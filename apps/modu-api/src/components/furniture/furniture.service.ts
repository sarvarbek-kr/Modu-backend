import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Furnitures, Furniture } from '../../libs/dto/furniture/furniture';
import { Direction, Message } from '../../libs/enums/common.enum';
import {
	AgentFurnituresInquiry,
	AllFurnituresInquiry,
	OrdinaryInquiry,
	FurnituresInquiry,
	FurnitureInput,
} from '../../libs/dto/furniture/furniture.input';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { FurnitureStatus } from '../../libs/enums/furniture.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewGroup } from '../../libs/enums/view.enum';
import { FurnitureUpdate } from '../../libs/dto/furniture/furniture.update';
import * as moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeService } from '../like/like.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { NotificationService } from '../notification/notification.service';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class FurnitureService {
	constructor(
		@InjectModel('Furniture') private readonly furnitureModel: Model<Furniture>,
		private memberService: MemberService,
		private viewService: ViewService,
		private likeService: LikeService,
		private notificationService: NotificationService,
	) {}

	public async createFurniture(input: FurnitureInput): Promise<Furniture> {
		try {
			const result = await this.furnitureModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberFurnitures',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Eror, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getFurniture(memberId: ObjectId, furnitureId: ObjectId): Promise<Furniture> {
		const search: T = {
			_id: furnitureId,
			furnitureStatus: FurnitureStatus.ACTIVE,
		};

		const targetFurniture: Furniture = await this.furnitureModel.findOne(search).lean<Furniture>().exec();
		if (!targetFurniture) throw new InternalServerErrorException(Message.N0_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: furnitureId, viewGroup: ViewGroup.FURNITURE };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.furnitureModel.findByIdAndUpdate(furnitureId, { $inc: { furnitureViews: 1 } }, { new: true }).exec();
				targetFurniture.furnitureViews++;
			}

			const likeInput = { memberId: memberId, likeRefId: furnitureId, likeGroup: LikeGroup.FURNITURE };
			targetFurniture.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		targetFurniture.memberData = await this.memberService.getMember(null, targetFurniture.memberId);
		return targetFurniture;
	}

	public async updateFurniture(memberId: ObjectId, input: FurnitureUpdate): Promise<Furniture> {
		let { furnitureStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			furnitureStatus: FurnitureStatus.ACTIVE,
		};

		if (furnitureStatus === FurnitureStatus.SOLD) soldAt = moment().toDate();
		else if (furnitureStatus === FurnitureStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.furnitureModel
			.findByIdAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberFurnitures',
				modifier: -1,
			});
		}
		return result;
	}

	public async getFurnitures(memberId: ObjectId, input: FurnituresInquiry): Promise<Furnitures> {
		const match: T = { furnitureStatus: FurnitureStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('match:', match);

		const result = await this.furnitureModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.N0_DATA_FOUND);
		console.log('result:', result);
		return result[0];
	}

	private shapeMatchQuery(match: T, input: FurnituresInquiry): void {
		const {
			memberId,
			locationList,
			conditionList,
			dimensionsList,
			colorList,
			materialList,
			brandList,
			typeList,
			periodsRange,
			pricesRange,
			options,
			text,
		} = input.search;
		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (locationList && locationList.length) match.furnitureLocation = { $in: locationList };
		if (conditionList && conditionList.length) match.furnitureCondition = { $in: conditionList };
		if (dimensionsList && dimensionsList.length) match.furnitureDimensions = { $in: dimensionsList };
		if (colorList && colorList.length) match.furnitureColor = { $in: colorList };
		if (materialList && materialList.length) match.furnitureMaterial = { $in: materialList };
		if (brandList && brandList.length) match.furnitureBrand = { $in: brandList };
		if (typeList && typeList.length) match.furnitureType = { $in: typeList };

		if (pricesRange) match.furniturePrice = { $gte: pricesRange.start, $lte: pricesRange.end };
		if (periodsRange) match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };

		if (text) match.furnitureTitle = { $regex: new RegExp(text, 'i') };
		if (options && options.length > 0) {
			match['$or'] = options.map((ele) => {
				return { [ele]: true };
			});
		}
	}

	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiry): Promise<Furnitures> {
		return await this.likeService.getFavoriteFurnitures(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiry): Promise<Furnitures> {
		return await this.viewService.getVisitedFurnitures(memberId, input);
	}

	public async getAgentFurnitures(memberId: ObjectId, input: AgentFurnituresInquiry): Promise<Furnitures> {
		const { furnitureStatus } = input.search;
		if (furnitureStatus === FurnitureStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			furnitureStatus: furnitureStatus ?? { $ne: FurnitureStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.furnitureModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.N0_DATA_FOUND);
		return result[0];
	}

	public async likeTargetFurniture(memberId: ObjectId, likeRefId: ObjectId): Promise<Furniture> {
		const target: Furniture = await this.furnitureModel
			.findOne({ _id: likeRefId, furnitureStatus: FurnitureStatus.ACTIVE })
			.exec();
		if (!target) throw new InternalServerErrorException(Message.N0_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.FURNITURE,
		};

		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.furnitureStatsEditor({ _id: likeRefId, targetKey: 'furnitureLikes', modifier: modifier });
		if (modifier === 1) {
			const notifInput: NotificationInput = {
				notificationGroup: NotificationGroup.FURNITURE,
				notificationType: NotificationType.LIKE,
				notificationTitle: 'Property Liked!',
				notificationDesc: 'Someone liked your property!',
				authorId: memberId,
				receiverId: target.memberId,
				propertyId: likeRefId,
			};
			await this.notificationService.createNotification(notifInput);
		}

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	public async getAllFurnituresByAdmin(input: AllFurnituresInquiry): Promise<Furnitures> {
		const { furnitureStatus, furnitureLocationList } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (furnitureStatus) match.furnitureStatus = furnitureStatus;
		if (furnitureLocationList) match.furnitureLocation = { $in: furnitureLocationList };

		const result = await this.furnitureModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit }, // [furniture1, furniture2]
							lookupMember, // memberData: [memberDataValue]
							{ $unwind: '$memberData' }, // memberData: memberDataValue
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.N0_DATA_FOUND);

		return result[0];
	}

	public async updateFurnitureByAdmin(input: FurnitureUpdate): Promise<Furniture> {
		let { furnitureStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			furnitureStatus: FurnitureStatus.ACTIVE,
		};

		if (furnitureStatus === FurnitureStatus.SOLD) soldAt = moment().toDate();
		else if (furnitureStatus === FurnitureStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.furnitureModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberFurnitures',
				modifier: -1,
			});
		}
		return result;
	}

	public async removeFurnitureByAdmin(furnitureId: ObjectId): Promise<Furniture> {
		const search: T = { _id: furnitureId, furnitureStatus: FurnitureStatus.DELETE };
		console.log('search:', search);
		const result = await this.furnitureModel.findOneAndDelete(search).exec();

		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	public async furnitureStatsEditor(input: StatisticModifier): Promise<Furniture> {
		const { _id, targetKey, modifier } = input;
		return await this.furnitureModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}
}

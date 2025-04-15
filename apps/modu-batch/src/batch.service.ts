import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/modu-api/src/libs/dto/member/member';
import { Furniture } from 'apps/modu-api/src/libs/dto/furniture/furniture';
import { MemberStatus, MemberType } from 'apps/modu-api/src/libs/enums/member.enum';
import { FurnitureStatus } from 'apps/modu-api/src/libs/enums/furniture.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Furniture') private readonly furnitureModel: Model<Furniture>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.furnitureModel
			.updateMany(
				{
					furnitureStatus: FurnitureStatus.ACTIVE,
				},
				{ furnitureRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.AGENT,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopFurnitures(): Promise<void> {
		const furnitures: Furniture[] = await this.furnitureModel
			.find({
				furnitureStatus: FurnitureStatus.ACTIVE,
				furnitureRank: 0,
			})
			.exec();

		const promisedList = furnitures.map(async (ele: Furniture) => {
			const { _id, furnitureLikes, furnitureViews } = ele;
			const rank = furnitureLikes * 2 + furnitureViews * 1;
			return await this.furnitureModel.findByIdAndUpdate(_id, { furnitureRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopAgents(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.AGENT,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberFurnitures, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberFurnitures * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	public getHello(): string {
		return 'Welcome to MODU BATCH Server!';
	}
}

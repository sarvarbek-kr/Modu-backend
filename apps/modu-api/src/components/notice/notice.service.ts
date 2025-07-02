import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, ObjectId } from 'mongoose';

import { Message } from '../../libs/enums/common.enum';
import { NoticeCategory, NoticeStatus } from '../../libs/enums/notice.enum';
import { T } from '../../libs/types/common';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInput } from '../../libs/dto/notice/notice.input';

@Injectable()
export class NoticeService {
	constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>) {}

	public async createNotice(memberId: ObjectId, input: NoticeInput): Promise<Notice> {
		try {
			input.memberId = memberId;
			input.event = true;
			const result = await this.noticeModel.create(input);
			return result;
		} catch (err: any) {
			console.log('Error, Service.createProperty', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNotices(memberId: ObjectId): Promise<Notices> {
		const match: T = {
			noticeStatus: NoticeStatus.ACTIVE,
			noticeCategory: NoticeCategory.NOTICE,
		};
		const sort: T = {
			createdAt: -1,
		};
		const result: Notices[] = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: 0 }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.N0_DATA_FOUND);
		return result[0];
	}
}

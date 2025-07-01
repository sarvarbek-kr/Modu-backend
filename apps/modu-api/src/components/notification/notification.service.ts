import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { T } from '../../libs/types/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from '../../libs/enums/common.enum';
import { NotificationStatus } from '../../libs/enums/notification.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationInput } from '../../libs/dto/notification/notification.input';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notification')
		private readonly notificatinoModel: Model<Notification>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	public async getNotifications(memberId: ObjectId): Promise<Notifications> {
		const match: T = {
			receiverId: memberId,
			notificationStatus: NotificationStatus.WAIT,
		};
		const sort: T = { createdAt: -1 };
		const result: Notifications[] = await this.notificatinoModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: 0 }, { $limit: 100 }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.N0_DATA_FOUND);
		return result[0];
	}

	public async createNotification(input: NotificationInput): Promise<void> {
		try {
			console.log('createNotification');
			const newNotif: Notification = await this.notificatinoModel.create(input);
			this.eventEmitter.emit('notification', newNotif.receiverId);
			console.log('newNotif', newNotif);
		} catch (err: any) {
			console.log('Notification Service Error: createNotification', err);
			throw new InternalServerErrorException(Message.CREATE_FAILED);
		}
	}

	public async updateNotification(memberId: ObjectId, notificationId: ObjectId): Promise<Notification> {
		const result: Notification = await this.notificatinoModel
			.findOneAndUpdate(
				{ _id: notificationId, receiverId: memberId },
				{ notificationStatus: NotificationStatus.READ },
				{ new: true },
			)
			.exec();
		if (!result) throw new Error(Message.UPDATE_FAILED);
		this.eventEmitter.emit('notification', result.receiverId);
		return result;
	}
}

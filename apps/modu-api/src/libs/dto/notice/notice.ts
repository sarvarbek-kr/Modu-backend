import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { TotalCounter } from '../member/member';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@ObjectType()
export class Notice {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus)
	noticeStatus?: NoticeStatus;

	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@Field(() => String, { nullable: true })
	noticeContent?: string;

	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@Field(() => String, { nullable: true })
	subject?: string;

	@Field(() => String, { nullable: true })
	content?: string;

	@Field(() => Boolean, { nullable: true })
	event?: boolean;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class Notices {
	@Field(() => [Notice])
	list: Notice[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}

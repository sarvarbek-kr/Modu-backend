import { Field, InputType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeCategory } from '../../enums/notice.enum';

@InputType()
export class NoticeInput {
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@Field(() => String, { nullable: true })
	noticeContent?: string;

	@Field(() => String, { nullable: true })
	subject?: string;

	@Field(() => String, { nullable: true })
	content?: string;

	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@Field(() => Boolean, { nullable: true })
	event?: boolean;
}

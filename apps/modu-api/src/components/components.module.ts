import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { FurnitureModule } from './furniture/furniture.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { NotificationModule } from './notification/notification.module';
import { NoticeModule } from './notice/notice.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		FurnitureModule,
		BoardArticleModule,
		LikeModule,
		ViewModule,
		CommentModule,
		FollowModule,
		NotificationModule,
		NoticeModule,
	],
})
export class ComponentsModule {}

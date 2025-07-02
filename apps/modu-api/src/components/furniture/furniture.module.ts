import { Module } from '@nestjs/common';
import { FurnitureResolver } from './furniture.resolver';
import { FurnitureService } from './furniture.service';
import { MongooseModule } from '@nestjs/mongoose';
import FurnitureSchema from '../../schemas/Furniture.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Furniture',
				schema: FurnitureSchema,
			},
		]),
		AuthModule,
		ViewModule,
		MemberModule,
		LikeModule,
		NotificationModule,
	],
	providers: [FurnitureResolver, FurnitureService],
	exports: [FurnitureService],
})
export class FurnitureModule {}

import { Module } from '@nestjs/common';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import NoticeSchema from '../../schemas/Notice.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Notice', schema: NoticeSchema }]), AuthModule],
	providers: [NoticeResolver, NoticeService],
})
export class NoticeModule {}

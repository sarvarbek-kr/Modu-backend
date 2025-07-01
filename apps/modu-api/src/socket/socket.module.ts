import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../components/auth/auth.module';
import { NotificationModule } from '../components/notification/notification.module';

@Module({
	imports: [AuthModule, NotificationModule],
	providers: [SocketGateway],
})
export class SocketModule {}

import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketGateway]
})
export class SocketModule {}


/// 23 minut hammasi togri negaur connection unsucsesfully
import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../components/notification/notification.service';
import { Notifications } from '../libs/dto/notification/notification';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient: number = 0;
	private clientsAuthMap = new Map<WebSocket, Member>();
	private messagesList: MessagePayload[] = [];

	constructor(
		private authService: AuthService,
		private notificationService: NotificationService,
	) {}

	@WebSocketServer()
	server: Server;

	public afterInit(_server: Server) {
		this.logger.verbose(`WebSocket Server Initialized. Total:[${this.summaryClient}]`);
	}

	private async retrieveAuth(req: any): Promise<Member> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err: any) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		this.summaryClient++;
		const authMember = await this.retrieveAuth(req);
		this.clientsAuthMap.set(client, authMember);
		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Connnection [${clientNick}] & Total:[${this.summaryClient}]`);
		let notifications: Notifications | any = [];
		if (authMember?._id) {
			notifications = await this.notificationService.getNotifications(authMember?._id);
			client.send(JSON.stringify({ event: 'notifications', notifications }));
		}
		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		client.send(JSON.stringify({ event: 'getMessages', list: this.messagesList }));
	}

	@OnEvent('notification', { async: true })
	public pushNotification(receiverId: any) {
		console.log('pushNotification');
		this.clientsAuthMap.forEach((member: Member, client: WebSocket) => {
			if (String(receiverId) === String(member?._id)) {
				this.notificationService.getNotifications(receiverId).then((data) => {
					client.send(JSON.stringify({ event: 'notifications', notifications: data }));
					console.log('Notifications event has been emitted!');
				});
			}
		});
	}

	public handleDisconnect(client: WebSocket) {
		this.summaryClient--;
		const authMember = this.clientsAuthMap.get(client);
		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.clientsAuthMap.delete(client);
		this.logger.verbose(`Disconnection [${clientNick}] & Total:[${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClients: this.summaryClient,
			memberData: authMember,
			action: 'left',
		};
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: any): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		const clientNick: string = authMember?.memberNick ?? 'Guest';
		const newMessage: MessagePayload = {
			event: 'message',
			text: payload,
			memberData: authMember,
		};
		this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`);
		this.messagesList.push(newMessage);
		if (this.messagesList.length > 5) this.messagesList.splice(0, this.messagesList.length - 5);
		this.emitMessage(newMessage);
	}

	private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}

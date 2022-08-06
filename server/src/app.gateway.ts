import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import {Prisma} from '@prisma/client';
import {Server, Socket} from 'Socket.IO';
import { MessageUpdatePayload } from './types/types';
import { CLIENT_URI } from './constants/constants';
import { AppService } from './app.service';

const users: Record<string, string> = {};

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  serveClient: false,
  namespace: 'chat'
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{
    constructor(private readonly appService: AppService) {}

    @WebSocketServer() server: Server;
    afterInit(server: Server) {
      console.log(server);
    }

    handleConnection(client: Socket, ...args: any[]) {
      const userName = client.handshake.query.userName as string;
      const socketId = client.id;
      users[socketId] = userName

      client.broadcast.emit('log', `${userName} connected`);
    }

    handleDisconnect(client: Socket) {
        const socketId = client.id;
        const userName = users[socketId];
        delete users[socketId];

        client.broadcast.emit('log', `${userName} disconnected`);
    }

    // Get all messages
    @SubscribeMessage('messages:get')
    async handleMessagesGet(): Promise<void> {
      const messages = await this.appService.getMessages();

      this.server.emit('messages', messages);
    }

    // Delete all messages
    @SubscribeMessage('messages:clear')
    async handleMessagesClear(): Promise<void> {
      await this.appService.clearMessages();
    }

    // Create message
    @SubscribeMessage('message:post')
    async handleMessagePost(
      @MessageBody()
      payload: Prisma.MessageCreateInput
    ): Promise<void> {
      const createdMessage = await this.appService.createMessage(payload);

      this.server.emit('message:post', createdMessage);

      this.handleMessagesGet();
    }

    // Update message
    @SubscribeMessage('message:put')
    async handleMessagePut(
      @MessageBody()
      payload:MessageUpdatePayload
    ): Promise<void> {
      const updatedMessage = await this.appService.updateMessage(payload);

      this.server.emit('message:put', updatedMessage);

      this.handleMessagesGet();
    }

    // Delete message
    @SubscribeMessage('message:delete')
    async handleMessageDelete(
      @MessageBody()
      payload: Prisma.MessageWhereUniqueInput
    ) {
      const removedMessage = await this.appService.removeMessage(payload);

      this.server.emit('message:delete', removedMessage);
      this.handleMessagesGet();
    }
  }

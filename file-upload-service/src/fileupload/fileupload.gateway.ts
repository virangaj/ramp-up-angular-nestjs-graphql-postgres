import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ cors: true })
export class FileUploadGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server;
  private readonly logger = new Logger(FileUploadGateway.name, {
    timestamp: true,
  });

  afterInit() {
    this.logger.log('Initialized');
  }
  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.log(`Number of connected clients: ${sockets.size}`);
    this.server.emit('connected', { message: 'Connection Established' });
  }
  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() device: string,
    @ConnectedSocket() client: any,
  ): void {
    client.join(device);
    this.logger.log('New client connected from : ' + device);
    this.sendNotification(200, 'Join room');
  }
  sendNotification(status: number, message: string): void {
    this.logger.log(`Send Final Message ${message}`);
    this.server.emit('process-status', { status: status, message: message });
  }

  sendNotificationWithData(topic: string, status: number, message: any): void {
    this.logger.log(`Send Final Message ${message}`);
    this.server.emit(topic, { status: status, data: message });
  }
}

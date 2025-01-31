import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3002');
  }
  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }
  onConnectedMessage(callback: (message: string) => void): void {
    this.socket.on('connected', callback);
  }
  onFileUploadStatus(callback: (message: string) => void): void {
    this.socket.on('process-status', callback);
  }
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

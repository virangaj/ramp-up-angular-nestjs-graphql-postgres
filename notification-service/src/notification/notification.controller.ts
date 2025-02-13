import { Controller, Post, Put } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(){
    await this.notificationService.create()
  }
  @Put()
  async update(){
    await this.notificationService.update()
  }
}

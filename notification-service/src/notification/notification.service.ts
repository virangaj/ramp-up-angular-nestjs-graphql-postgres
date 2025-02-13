import { Injectable, Logger } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer/producer.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name, {
    timestamp: true,
  });

  constructor(private readonly _kafka: ProducerService) {}
  async create() {
    this.logger.log('Create method initiated');
    this._kafka.produce({
      topic: 'CREATE_STUDENT',
      messages: [{ value: 'this is notification create' }],
    });
  }
  async update() {
    this.logger.log('Update method initiated');
    this._kafka.produce({
      topic: 'UPDATE_STUDENT',
      messages: [{ value: 'this is notification update' }],
    });
  }
}

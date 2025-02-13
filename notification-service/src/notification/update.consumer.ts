import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';

@Injectable()
export class UpdateConsumer implements OnModuleInit {
  private readonly logger = new Logger(UpdateConsumer.name, {
    timestamp: true,
  });
  constructor(private readonly _consumer: ConsumerService) {}
  async onModuleInit() {
    this._consumer.consume(
      'update-client',
      { topic: 'UPDATE_STUDENT' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          this.logger.log({
            source: 'update-consumer',
            message: message.value,
            partition: partition.toString(),
            topic: topic.toString(),
          });
        },
      },
    );
  }
}

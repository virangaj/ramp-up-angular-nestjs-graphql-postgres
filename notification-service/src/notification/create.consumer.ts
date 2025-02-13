import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';

@Injectable()
export class CreateConsumer implements OnModuleInit {
  private readonly logger = new Logger(CreateConsumer.name, {
    timestamp: true,
  });
  constructor(private readonly _consumer: ConsumerService) {}
  async onModuleInit() {
    this._consumer.consume(
      'create-client',
      { topic: 'CREATE_STUDENT' },
      {
        eachMessage: async ({ topic, partition, message }) => {
          this.logger.log({
            source: 'create-consumer',
            message: message.value.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
        },
      },
    );
  }
}

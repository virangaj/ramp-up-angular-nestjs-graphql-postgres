import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(ProducerService.name, {
    timestamp: true,
  });
  private readonly kafka = new Kafka({
    brokers: ['localhost:9092'],
  });
  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.log(`Kafka connection error: ${err.message}`);
    }
  }
  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  async produce(record: ProducerRecord) {
    try {
      await this.producer.send(record);
      this.logger.log(`Sent message: ${JSON.stringify(record)}`);
    } catch (err) {
      this.logger.error(`Failed to send message: ${err.message}`);
    }
  }
}

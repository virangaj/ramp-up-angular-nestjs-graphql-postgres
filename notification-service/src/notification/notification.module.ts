import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { KafkaModule } from 'src/kafka/kafka.module';
import { CreateConsumer } from './create.consumer';
import { UpdateConsumer } from './update.consumer';

@Module({
  imports: [KafkaModule],
  controllers: [NotificationController],
  providers: [NotificationService, CreateConsumer, UpdateConsumer],
})
export class NotificationModule {}

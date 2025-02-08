import { Module } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileuploadController } from './fileupload.controller';
import { BullModule } from '@nestjs/bull';
import { FILEUPLOAD_QUEUE } from 'src/constants/constant';
import { FileUploadConsumer } from './fileupload.consumer';
import { FileUploadGateway } from './fileupload.gateway';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: FILEUPLOAD_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'fixed',
          delay: 10000,
        },
      },
    }),
  ],
  controllers: [FileuploadController],
  providers: [FileuploadService, FileUploadConsumer, FileUploadGateway],
})
export class FileuploadModule {}

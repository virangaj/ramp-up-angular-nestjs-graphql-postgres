import { Module } from '@nestjs/common';
import { FileuploadModule } from './fileupload/fileupload.module';

@Module({
  imports: [FileuploadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

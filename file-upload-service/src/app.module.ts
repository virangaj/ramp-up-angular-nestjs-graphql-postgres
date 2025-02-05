import { Module } from '@nestjs/common';
import { FileuploadModule } from './fileupload/fileupload.module';
@Module({
  imports: [FileuploadModule],
  controllers: [],
  exports: [],
  providers:[]
})
export class AppModule {}

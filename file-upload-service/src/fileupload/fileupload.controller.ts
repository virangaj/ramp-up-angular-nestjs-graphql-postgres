import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileUploadInterceptor } from 'src/interceptor/fileupload-interceptor';
import { NumberAddInterceptor } from 'src/interceptor/number-add';
import { FileuploadService } from './fileupload.service';
@Controller('/fileupload')
export class FileuploadController {
  constructor(private readonly fileuploadService: FileuploadService) {}
  private readonly logger = new Logger(FileuploadController.name, {
    timestamp: true,
  });
  @Post('/data')
  @UseInterceptors(FileUploadInterceptor)
  @HttpCode(202)
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    this.logger.log('File uploaded and save to local : ' + file.filename);
    return this.fileuploadService.processBulkUplod(file.filename);
  }

  @Post('/test')
  @UseInterceptors(NumberAddInterceptor)
  async testPost(@Body() data: { id: number }) {
    return this.fileuploadService.testService(data.id);
  }
}

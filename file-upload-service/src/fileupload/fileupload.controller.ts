import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { NumberAddInterceptor } from 'src/interceptor/number-add';
import { FileUploadInterceptor } from 'src/interceptor/fileupload-interceptor';
@Controller('/fileupload')
export class FileuploadController {
  constructor(private readonly fileuploadService: FileuploadService) {}
  private readonly logger = new Logger(FileuploadController.name, {
    timestamp: true,
  });
  @Post('/data')
  @UseInterceptors(FileUploadInterceptor)
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    this.logger.log('File uploaded and save to local : ' + file.filename);
    return this.fileuploadService.processBulkUplod(file.filename);
  }
  @Post('/test-upload')
  @UseInterceptors(FileUploadInterceptor)
  async testFileUpload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.fileuploadService.testFileUpload(file.filename);
  }
}

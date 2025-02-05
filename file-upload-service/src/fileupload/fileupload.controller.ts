import {
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
@Controller('/fileupload')
export class FileuploadController {
  constructor(private readonly fileuploadService: FileuploadService) {}
  private readonly logger = new Logger(FileuploadController.name, {
    timestamp: true,
  });
  @Post('/data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        //  save file to load storage
        destination: './uploads',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}_${file.originalname}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        const validTypes = [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (validTypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new Error('Invalid file type'), false);
        }
      },
    }),
  )
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    this.logger.log('File uploaded and save to local : ' + file.filename);
    return this.fileuploadService.processBulkUplod(file.filename);

  }
}

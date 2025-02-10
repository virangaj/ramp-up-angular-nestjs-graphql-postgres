import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Queue } from 'bull';
import * as path from 'path';
import { FILEUPLOAD_QUEUE, PROCESS_STARTED } from 'src/constants/constant';
import { FileUploadGateway } from './fileupload.gateway';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class FileuploadService {
  private readonly logger = new Logger(FileuploadService.name, {
    timestamp: true,
  });

  constructor(
    @InjectQueue(FILEUPLOAD_QUEUE) private readonly fileUploadQueue: Queue,
    private fileUploadGateway: FileUploadGateway,
  ) {}

  async processBulkUplod(filename: string) {
    // create the filepath
    const filePath = path.join(
      __dirname.replace('dist', ''),
      `../uploads/${filename}`,
    );
    this.logger.log('Found file in : ' + filePath);

    try {
      this.logger.log('Adding job to queue...');
      const referenceNo = uuidv4();
      this.fileUploadQueue.add(FILEUPLOAD_QUEUE, { referenceNo, filePath });
      this.logger.log('Job added successfully!');
      this.fileUploadGateway.sendNotificationWithData(PROCESS_STARTED, 200, {
        referenceNo: referenceNo,
        message: 'File Processing started, This may take time!',
      });
      return {
        referenceNo: referenceNo,
        message: 'File Processing started, This may take time!',
      };
    } catch (err) {
      this.logger.error('Failed to parse file : ' + err.message);
      throw new InternalServerErrorException({
        message: 'FIle upload failed',
      });
    }
  }


  async testFileUpload(filename: string) {
    this.logger.log('Test Service Called with FILENMAfilename :' + filename);
    return { message: 'Test Service Called with FILENMAfilename :' + filename };
  }
}

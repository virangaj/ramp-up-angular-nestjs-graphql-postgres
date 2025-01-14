import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import * as path from 'path';
import { FILEUPLOAD_QUEUE } from 'src/constants/constant';
@Injectable()
export class FileuploadService {
  private readonly logger = new Logger(FileuploadService.name, {
    timestamp: true,
  });
 
  constructor(
    @InjectQueue(FILEUPLOAD_QUEUE) private readonly fileUploadQueue: Queue,
  ) {
    
  }

  
  async processBulkUplod(filename: string) {
    // create the filepath
    const filePath = path.join(
      __dirname.replace('dist', ''),
      `../uploads/${filename}`,
    );
    this.logger.log('Found file in : ' + filePath);

    try {
      this.logger.log('Adding job to queue...');
      this.fileUploadQueue.add(FILEUPLOAD_QUEUE, { filePath });
      this.logger.log('Job added successfully!');
      return { message: 'File upload function triggered successfully' };
    } catch (err) {
      this.logger.error('Failed to parse file : ' + err.message);
      return null;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
@Injectable()
export class FileuploadService {
  private readonly logger = new Logger(FileuploadService.name, {
    timestamp: true,
  });
  processBulkUplod(filename: string) {
    // create the filepath
    const filePath = path.join(
      __dirname.replace('dist', ''),
      `../uploads/${filename}`,
    );
    this.logger.log('Found file in : ' + filePath);

    try {
      //  naviagate to file in local file path adn open the file
      //  find the data from sheet
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      return data;
    } catch (err) {
      this.logger.error('Failed to parse file : ' + err.message);
      return null;
    } finally {
      //  delete the file from localstorage
      fs.unlink(filePath, (err) => {
        if (err) {
          this.logger.error('Failed to delete file : ' + err.message);
        } else {
          this.logger.log('Deleted file : ' + filePath);
        }
      });
    }
  }
}

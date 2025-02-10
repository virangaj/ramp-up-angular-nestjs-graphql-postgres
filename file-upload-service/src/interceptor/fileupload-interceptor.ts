import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FileUploadInterceptor.name, {
    timestamp: true,
  });
  private upload = multer({
    storage: diskStorage({
      destination: 'uploads/',
      filename: (req, file, callback) => {
        const filename = `${Date.now()}-${file.originalname}`;
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
        callback(null, false);
      }
    },
  }).single('file');

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    await new Promise<void>((resolve, reject) => {
      this.upload(request, request.res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!request.file?.filename) {
      throw new BadRequestException('Invalid File Type');
    }
    const filename = request.file?.filename;

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `After... ${Date.now()}ms, Uploaded file: ${filename}`,
          ),
        ),
      );
  }
}

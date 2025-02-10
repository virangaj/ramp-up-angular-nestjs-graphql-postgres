import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
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
  }).single('file');

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // this.logger.log('Before...');
    const request = context.switchToHttp().getRequest();

    await new Promise<void>((resolve, reject) => {
      this.upload(request, request.res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

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

import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChunkMetadata } from '@progress/kendo-angular-upload';
import { Observable, of, delay, concat } from 'rxjs';

@Injectable()
export class UploadInterceptor implements HttpInterceptor {
  public fileMap: Map<string, any[]> = new Map();

  // eslint-disable-next-line
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url === 'saveUrl') {
      if (!this.isIE()) {
        // Parsing the file metadata.
        const metadata: ChunkMetadata = JSON.parse(req.body.get('metadata'));

        // Retrieving the uid of the uploaded file.
        const fileUid = metadata.fileUid;

        if (metadata.chunkIndex === 0) {
          this.fileMap.set(fileUid, []);
        }

        // Storing the chunks of the file.
        this.fileMap.get(fileUid)?.push(req.body.get('files'));

        // Checking if this is the last chunk of the file
        if (metadata.chunkIndex === metadata.totalChunks - 1) {
          const completeFile = new Blob(this.fileMap.get(fileUid) || [], {
            type: metadata.contentType,
          });
          console.log('Complete file:', completeFile);
        }
      }

      const events: Observable<HttpEvent<unknown>>[] = [30, 60, 100].map((x) =>
        of(<HttpProgressEvent>{
          type: HttpEventType.UploadProgress,
          loaded: x,
          total: 100,
        })
      );

      const success = of(new HttpResponse({ status: 200 })).pipe(delay(1000));
      events.push(success);

      return concat(...events);
    }

    if (req.url === 'removeUrl') {
      return of(new HttpResponse({ status: 200 }));
    }

    return next.handle(req);
  }

  public isIE(): RegExpMatchArray | null {
    return window.navigator.userAgent.match(/(MSIE|Trident)/);
  }
}

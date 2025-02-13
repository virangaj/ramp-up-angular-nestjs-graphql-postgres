import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NumberAddInterceptor implements NestInterceptor {
  private readonly logger = new Logger(NumberAddInterceptor.name, {
    timestamp: true,
  });
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.logger.log('Before');
    const body = context.switchToHttp().getRequest().body;
    if (body.id === 3) {
      this.logger.error('Number is not acceptable');
      throw new NotAcceptableException({
        status: 403,
        message: 'Number is not acceptable',
      });
    }
    return next.handle().pipe(map(() => ({ id: body.id + 4 })));
  }
}

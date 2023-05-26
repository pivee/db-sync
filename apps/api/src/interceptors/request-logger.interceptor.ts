import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();

    const request: Request = httpContext.getRequest();
    const { method, url } = request;

    const response: Response = httpContext.getResponse();
    const { statusCode } = response;

    const requestId = crypto.randomUUID().split('-')[0];
    const timeBeforeResponse = Date.now();

    Logger.verbose(`${method} ${url}`, `>> ${requestId}`);

    return next.handle().pipe(
      tap(() => {
        Logger.verbose(
          `[${statusCode}] ${method} ${url} +${
            Date.now() - timeBeforeResponse
          }ms`,
          `<< ${requestId}`,
        );
      }),
    );
  }
}

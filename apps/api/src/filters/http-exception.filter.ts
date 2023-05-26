import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { HttpResponse } from '../modules/models/HttpResponse';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    Logger.error(exception);
    console.error(exception);

    return response
      .status(exception.status)
      .json(new HttpResponse(undefined, [exception?.getResponse()]));
  }
}

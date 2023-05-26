import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpResponse } from '../modules/models/HttpResponse';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    Logger.error(exception);
    console.error(exception);

    return response
      .status(exception?.status ?? 500)
      .json(new HttpResponse(undefined, [exception?.message ?? undefined]));
  }
}

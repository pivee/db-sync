import { IRequestWithProps } from '@/types/IRequestWithProps';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class TenantSourceMiddleware implements NestMiddleware {
  use(request: IRequestWithProps, response: Response, next: () => void) {
    request.tenant = {
      tenantCode: request.headers["x-tenant-code"] as string,
      datasourceUrl: process.env.TENANT_DATABASE_URL
    };

    next();
  }
}

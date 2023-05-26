import { HttpResponse as IHttpResponse } from '../../types/core';

export class HttpResponse<T> implements IHttpResponse<T> {
  constructor(public readonly data?: T, public readonly errors?: any[]) {}
}

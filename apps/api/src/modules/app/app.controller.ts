import { TypedRoute } from '@nestia/core';
import { Controller } from '@nestjs/common';
import { TextResponse } from '../../types/core';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TypedRoute.Get()
  getHello(): TextResponse {
    return { data: this.appService.getHello() };
  }
}

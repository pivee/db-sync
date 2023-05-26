import { Module } from '@nestjs/common';
import { EntitiesModule } from '../entities/entities.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from 'src/interceptors/request-logger.interceptor';

@Module({
  imports: [EntitiesModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class AppModule {}

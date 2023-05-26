import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cp from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV !== 'production') {
    cp.execSync('npx nestia swagger');

    const swaggerDocument = JSON.parse(
      readFileSync(join(__dirname, 'swagger.json'), 'utf8'),
    );

    app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  app.useGlobalFilters(new HttpExceptionFilter(), new GlobalExceptionFilter());

  await app.listen(process.env.PORT ?? 3000, () => {
    Logger.log(
      `Server is running on port ${process.env.PORT ?? 3000}`,
      'NestApplication',
    );
  });
}
bootstrap();

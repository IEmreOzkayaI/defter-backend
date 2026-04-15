import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ENV_SCHEMA, ENV_VAR } from './common/env.config';
import { GlobalExceptionFilter } from './common/filters';
import { GlobalResponseInterceptor } from './common/interceptors';
import { CommonUtil } from './common/utils';

async function bootstrap() {
  CommonUtil.validateEnv(ENV_VAR, ENV_SCHEMA);
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  app.enableShutdownHooks();

  const rawCors = ENV_VAR.CORS_ORIGIN?.trim();
  const corsOrigin: boolean | string[] =
    rawCors && rawCors.length > 0
      ? (() => {
          const list = rawCors.split(',').map((o) => o.trim()).filter(Boolean);
          return list.length > 0 ? list : true;
        })()
      : true;

  app.enableCors({
    origin: corsOrigin,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    credentials: false,
    optionsSuccessStatus: 204,
    maxAge: 86_400,
  });

  /* !============================== Global Settings ==============================! */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      forbidUnknownValues: false,
      stopAtFirstError: true,
      exceptionFactory: (errors) => new BadRequestException({ message: errors }),
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });
  /* !============================== Global Settings ==============================! */

  await app.listen(ENV_VAR.PORT || 3000);
}
bootstrap();

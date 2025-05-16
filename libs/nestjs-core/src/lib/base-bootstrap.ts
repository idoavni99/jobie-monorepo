// eslint-disable-next-line unicorn/prefer-module
require('hpropagate')({ headersToPropagate: ['x-jobie-authorization'] });
import { INestApplication, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { commonConfigKey, CommonConfigType } from './config/common.config';
import { setupSwagger } from './swagger/setup-swagger';

export const baseBootstrap = async (
  AppModule: Type,
  beforeListen?: (app: INestApplication) => Promise<void>
) => {
  const isDevelopment = process.env['NODE_ENV'] !== 'production';
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: isDevelopment
      ? {
          allowedHeaders: ['x-jobie-authorization', 'content-type'],
          origin: 'https://localhost:4200',
          credentials: true,
        }
      : undefined,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);
  setupSwagger(app);

  await beforeListen?.(app);

  const { port } = app.get<CommonConfigType>(commonConfigKey);

  await app.listen(port, isDevelopment ? '127.0.0.1' : '0.0.0.0');
  logger.log(`🚀 Application is running on: http://localhost:${port}`);

  return app;
};

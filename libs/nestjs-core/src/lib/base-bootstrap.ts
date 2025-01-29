import { INestApplication, Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { commonConfigKey, CommonConfigType } from './config/common.config';
import { setupSwagger } from './swagger/setup-swagger';

export const baseBootstrap = async (
  AppModule: Type,
  beforeListen?: (app: INestApplication) => Promise<void>
) => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);
  setupSwagger(app);

  await beforeListen?.(app);

  const { port } = app.get<CommonConfigType>(commonConfigKey);

  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);

  return app;
};

import { Type, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger/setupSwagger';
import { Logger } from 'nestjs-pino';

export const baseBootstrap = async (AppModule: Type<any>) => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  setupSwagger(app);

  return app;
};

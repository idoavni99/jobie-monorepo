import { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { setupSwagger } from './swagger/setup-swagger';

export const baseBootstrap = async (AppModule: Type) => {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  setupSwagger(app);

  return app;
};

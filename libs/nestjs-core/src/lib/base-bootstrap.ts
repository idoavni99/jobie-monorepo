import { Type, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger/setupSwagger';

export const baseBootstrap = async (AppModule: Type<any>) => {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  return app;
};

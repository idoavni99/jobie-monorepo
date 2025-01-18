/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { baseBootstrap } from '@jobie/nestjs-core';
import { AppModule } from './app/app.module';

baseBootstrap(AppModule).then(async (app) => {
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
});

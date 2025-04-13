/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { baseBootstrap } from '@jobie/nestjs-core';
import { AppModule } from './app/app.module';

baseBootstrap(AppModule);

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseAppModule } from '@jobie/nestjs-core';

@Module({
  imports: [BaseAppModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

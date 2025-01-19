import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseAppModule } from '@jobie/nestjs-core';
import { ConfigModule } from '@nestjs/config';
import { gatewayConfig } from '../config/gateway.config';

@Module({
  imports: [
    BaseAppModule,
    ConfigModule.forRoot({ isGlobal: true, load: [gatewayConfig] }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

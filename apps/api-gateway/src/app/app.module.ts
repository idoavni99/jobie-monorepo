import { Module } from '@nestjs/common';
import { BaseAppModule } from '@jobie/nestjs-core';
import { ConfigModule } from '@nestjs/config';
import { gatewayConfig } from '../config/gateway.config';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    LoginModule,
    BaseAppModule,
    ConfigModule.forRoot({ isGlobal: true, load: [gatewayConfig] }),
  ],
})
export class AppModule {}

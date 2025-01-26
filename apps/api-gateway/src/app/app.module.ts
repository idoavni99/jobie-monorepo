import { BaseAppModule } from '@jobie/nestjs-core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { authConfig } from '../config/auth.config';
import { gatewayConfig } from '../config/gateway.config';
import { mongoConfig, MongoConfigType } from '../config/mongo.config';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [gatewayConfig, authConfig, mongoConfig],
    }),
    BaseAppModule,
    MongooseModule.forRootAsync({
      useFactory: (config: MongoConfigType) => {
        return config;
      },
      inject: [mongoConfig.KEY],
    }),
    LoginModule,
  ],
})
export class AppModule {}

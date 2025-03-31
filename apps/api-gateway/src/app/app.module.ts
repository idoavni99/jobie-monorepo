import { mongoConfig, MongoConfigType } from '@jobie/data-entities-core';
import { BaseAppModule } from '@jobie/nestjs-core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { authConfig } from '../config/auth.config';
import { gatewayConfig } from '../config/gateway.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    BaseAppModule.forRoot({
      rootConfigs: [gatewayConfig, authConfig, mongoConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: MongoConfigType) => {
        return config;
      },
      inject: [mongoConfig.KEY],
    }),
    AuthModule,
  ],
})
export class AppModule {}

import { mongoConfig, MongoConfigType } from '@jobie/data-entities-core';
import { BaseAppModule } from '@jobie/nestjs-core';
import { UsersModule } from '@jobie/users/nestjs';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from './config/app.config';
import { RoadmapCalibrationModule } from './roadmap/roadmap.module';

@Module({
  imports: [
    BaseAppModule.forRoot({
      rootConfigs: [mongoConfig, appConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: MongoConfigType) => {
        return config;
      },
      inject: [mongoConfig.KEY],
    }),
    UsersModule.forRoot(),
    RoadmapCalibrationModule,
  ],
})
export class AppModule { }

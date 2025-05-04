import { mongoConfig, MongoConfigType } from '@jobie/data-entities-core';
import { BaseAppModule } from '@jobie/nestjs-core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MilestoneManagementModule } from './milestone/milestone.module';

@Module({
  imports: [
    BaseAppModule.forRoot({
      rootConfigs: [mongoConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: MongoConfigType) => {
        return config;
      },
      inject: [mongoConfig.KEY],
    }),
    MilestoneManagementModule,
  ],
})
export class AppModule {}

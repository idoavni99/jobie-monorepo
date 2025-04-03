import { mongoConfig, MongoConfigType } from '@jobie/data-entities-core';
import { BaseAppModule } from '@jobie/nestjs-core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileModule } from './profile/profile.module';
import { RoadmapModule } from './roadmap/roadmap.module';

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
    ProfileModule,
    RoadmapModule,
  ],
})
export class AppModule {}

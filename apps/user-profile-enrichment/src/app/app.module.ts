import { mongoConfig, MongoConfigType } from '@jobie/data-entities-core';
import { BaseAppModule } from '@jobie/nestjs-core';
import { UsersModule } from '@jobie/users/nestjs';
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
    UsersModule.forRoot(),
    ProfileModule,
    RoadmapModule,
  ],
})
export class AppModule {}

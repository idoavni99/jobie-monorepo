import { LinkedinModule } from '@jobie/linkedin';
import { OpenAIModule } from '@jobie/openai';
import { RoadmapModule } from '@jobie/roadmap/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { APP_CONFIG_KEY, AppConfigType } from '../config/app.config';
import { RoadmapGenerationService } from './roadmap-generation.service';
import { RoadmapController } from './roadmap.controller';

@Module({
  imports: [
    RoadmapModule,
    OpenAIModule.register(),
    LinkedinModule.register(),
    HttpModule.registerAsync({
      useFactory: ({ milestoneManagementUrl }: AppConfigType) => ({
        baseURL: milestoneManagementUrl,
      }),
      inject: [APP_CONFIG_KEY],
    }),
  ],
  controllers: [RoadmapController],
  providers: [RoadmapGenerationService],
})
export class RoadmapCalibrationModule {}

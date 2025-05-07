import { LinkedinModule } from '@jobie/linkedin';
import { OpenAIModule } from '@jobie/openai';
import { RoadmapModule } from '@jobie/roadmap/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RoadmapGenerationService } from './roadmap-generation.service';
import { RoadmapController } from './roadmap.controller';

@Module({
  imports: [
    RoadmapModule,
    OpenAIModule.register(),
    LinkedinModule.register(),
    HttpModule,
  ],
  controllers: [RoadmapController],
  providers: [RoadmapGenerationService],
})
export class RoadmapCalibrationModule {}

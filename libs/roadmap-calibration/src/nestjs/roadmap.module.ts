import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RoadmapCalibartionConfig, roadmapCalibrationConfig } from './config';
import { Milestone, MilestoneSchema } from './milestone.schema';
import { RoadmapGenerationService } from './roadmap-generation.service';
import { RoadmapRepository } from './roadmap.repository';
import { Roadmap, RoadmapSchema } from './roadmap.schema';

@Module({
  imports: [
    ConfigModule.forFeature(roadmapCalibrationConfig),
    MongooseModule.forFeature([
      { name: Roadmap.name, schema: RoadmapSchema },
      { name: Milestone.name, schema: MilestoneSchema },
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule.forFeature(roadmapCalibrationConfig)],
      useFactory: (config: RoadmapCalibartionConfig) => ({
        baseURL: `https://${config.linkedinRapidApiHost}`,
        headers: {
          'x-rapidapi-host': config.linkedinRapidApiHost,
          'x-rapidapi-key': config.rapidApiKey,
        },
      }),
      inject: [roadmapCalibrationConfig.KEY],
    }),
  ],
  providers: [RoadmapRepository, RoadmapGenerationService],
  exports: [RoadmapRepository, RoadmapGenerationService],
})
export class RoadmapCalibrationModule {}

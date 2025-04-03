import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Roadmap, RoadmapSchema } from './roadmap.schema';
import { Milestone, MilestoneSchema } from './milestone.schema';
import { RoadmapRepository } from './roadmap.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Roadmap.name, schema: RoadmapSchema },
      { name: Milestone.name, schema: MilestoneSchema },
    ]),
  ],
  providers: [RoadmapRepository],
  exports: [RoadmapRepository, MongooseModule],
})
export class RoadmapCalibrationModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MilestoneRepository } from './milestone.repository';
import { Milestone, MilestoneSchema } from './milestone.schema';
import { MilestoneService } from './milestone.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Milestone.name, schema: MilestoneSchema },
    ]),
  ],
  providers: [MilestoneService, MilestoneRepository],
  exports: [MilestoneService],
})
export class MilestoneModule {}

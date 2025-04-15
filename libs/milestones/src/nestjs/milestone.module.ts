import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Milestone, MilestoneSchema } from './milestone.schema';
import { MilestoneService } from './milestone.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Milestone.name, schema: MilestoneSchema },
    ]),
  ],
  providers: [MilestoneService],
  exports: [MilestoneService],
})
export class MilestoneModule {}

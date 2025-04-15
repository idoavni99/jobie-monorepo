import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Roadmap, RoadmapSchema } from './roadmap.schema';
import { RoadmapService } from './roadmap.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Roadmap.name, schema: RoadmapSchema }]),
  ],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}

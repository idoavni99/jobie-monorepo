import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoadmapRepository } from './roadmap.repository';
import { Roadmap, RoadmapSchema } from './roadmap.schema';
import { RoadmapService } from './roadmap.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Roadmap.name, schema: RoadmapSchema }]),
  ],
  providers: [RoadmapRepository, RoadmapService],
  exports: [RoadmapService, RoadmapRepository],
})
export class RoadmapModule {}

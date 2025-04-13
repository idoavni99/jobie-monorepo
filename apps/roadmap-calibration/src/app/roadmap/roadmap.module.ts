import { RoadmapCalibrationModule } from '@jobie/roadmap-calibration/nestjs';
import { Module } from '@nestjs/common';
import { RoadmapController } from './roadmap.controller';
import { RoadmapService } from './roadmap.service';

@Module({
  controllers: [RoadmapController],
  imports: [RoadmapCalibrationModule],
  providers: [RoadmapService],
})
export class RoadmapModule {}

import { RoadmapCalibrationModule } from '@jobie/roadmap-calibration';
import { UsersModule } from '@jobie/users/nestjs';
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';


@Module({
  imports: [UsersModule],
  controllers: [ProfileController, RoadmapCalibrationModule],
  providers: [ProfileService],
})
export class ProfileModule { }

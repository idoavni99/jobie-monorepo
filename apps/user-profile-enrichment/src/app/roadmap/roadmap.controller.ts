import { AuthUser } from '@jobie/auth-core';
import {
  Roadmap,
  RoadmapGenerationService,
} from '@jobie/roadmap-calibration/nestjs';
import { UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types';
import { Controller, Get, Post } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService,
    private readonly roadmapGenerationService: RoadmapGenerationService,
    private readonly usersRepository: UsersRepository
  ) {}

  @Post('generate')
  async generate(@AuthUser() user: TUser): Promise<Roadmap> {
    const roadmapTitles =
      await this.roadmapGenerationService.generateSummarizedRoadmap(user._id);

    return this.roadmapService.generateInitialRoadmap(user._id, roadmapTitles);
  }

  @Post('approve')
  async approve(@AuthUser() user: TUser): Promise<Roadmap | null> {
    return this.roadmapService.approveRoadmap(user._id);
  }

  @Get()
  async get(@AuthUser() user: TUser): Promise<Roadmap | null> {
    return this.roadmapService.getRoadmapByUserId(user._id);
  }
}

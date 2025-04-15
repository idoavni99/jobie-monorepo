import { AuthUser } from '@jobie/auth-core';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { TUser } from '@jobie/users/types';
import { Controller, Get, Post } from '@nestjs/common';
import { RoadmapGenerationService } from './roadmap-generation.service';

@Controller()
export class RoadmapController {
  constructor(
    private readonly roadmapGenerationService: RoadmapGenerationService,
    private readonly roadmapService: RoadmapService
  ) {}

  @Post('generate')
  async generate(@AuthUser() user: TUser): Promise<Roadmap> {
    const roadmap =
      await this.roadmapGenerationService.generateSummarizedRoadmap(user._id);

    return this.roadmapService.saveRoadmap(roadmap);
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

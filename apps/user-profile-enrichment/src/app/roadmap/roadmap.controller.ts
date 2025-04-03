import { AuthUser } from '@jobie/auth-core';
import {
  Roadmap,
  RoadmapGenerationService,
} from '@jobie/roadmap-calibration/nestjs';
import { TUser } from '@jobie/users/types';
import { Controller, Get, Post, UnauthorizedException } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
  constructor(
    private readonly roadmapService: RoadmapService,
    private readonly roadmapGenerationService: RoadmapGenerationService
  ) {}

  @Post('generate')
  async generate(@AuthUser() user: TUser): Promise<Roadmap> {
    if (!user.linkedinProfileUrl || !user.aspirationalLinkedinUrl) {
      throw new UnauthorizedException('Missing user profile data');
    }

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
    if (user?._id) throw new UnauthorizedException('User not found in request');
    return this.roadmapService.getRoadmapByUserId(user._id);
  }
}

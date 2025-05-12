import { AuthUser } from '@jobie/auth-core';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { TUser } from '@jobie/users/types';
import { HttpService } from '@nestjs/axios';
import { Controller, Get, Post } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RoadmapGenerationService } from './roadmap-generation.service';
@Controller()
export class RoadmapController {
  constructor(
    private readonly roadmapGenerationService: RoadmapGenerationService,
    private readonly roadmapService: RoadmapService,
    private readonly httpService: HttpService
  ) {}

  @Post('generate')
  async generate(@AuthUser() user: TUser): Promise<Roadmap> {
    // generate the roadmap
    const roadmap =
      await this.roadmapGenerationService.generateSummarizedRoadmap(user._id);

    // send the first three milestones to the milestone-management service for generation & saving
    const initialMilestones = roadmap.milestones.slice(0, 3);
    await firstValueFrom(
      this.httpService.post('/initialGenerate', initialMilestones)
    );
    // save the roadmap to DB
    return this.roadmapService.createRoadmap(roadmap);
  }
  @Get()
  async get(@AuthUser() user: TUser): Promise<Roadmap | null> {
    return this.roadmapService.getRoadmapByUserId(user._id);
  }

  @Post('approve')
  async approve(@AuthUser() user: TUser): Promise<Roadmap | null> {
    return this.roadmapService.approveRoadmap(user._id);
  }
}

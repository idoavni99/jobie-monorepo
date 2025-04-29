import { AuthUser } from '@jobie/auth-core';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { TUser } from '@jobie/users/types';
import { Controller, Get, Post, Req } from '@nestjs/common';
import { RoadmapGenerationService } from './roadmap-generation.service';
@Controller()
export class RoadmapController {
  constructor(
    private readonly roadmapGenerationService: RoadmapGenerationService,
    private readonly roadmapService: RoadmapService
  ) {}

  @Post('generate')
  async generate(
    @AuthUser() user: TUser,
    @Req() request: Request
  ): Promise<Roadmap | any> {
    try {
      const roadmap =
        await this.roadmapGenerationService.generateSummarizedRoadmap(
          user._id,
          request.headers['x-jobie-authorization']
        );
      return this.roadmapService.createRoadmap(roadmap);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : typeof error === 'object'
            ? JSON.stringify(error)
            : String(error),
      };
    }
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

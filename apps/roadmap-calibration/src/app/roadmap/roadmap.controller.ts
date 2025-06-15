import { AuthUser } from '@jobie/auth-core';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { SuggestAspirationsDto } from './dto';
import { RoadmapGenerationService } from './roadmap-generation.service';
@Controller()
export class RoadmapController {
  private readonly logger = new Logger(RoadmapController.name);
  constructor(
    private readonly roadmapGenerationService: RoadmapGenerationService,
    private readonly roadmapService: RoadmapService,
    private readonly usersRepository: UsersRepository,
    private readonly httpService: HttpService
  ) {}

  @Post('suggest-aspirations')
  async suggest(
    @AuthUser() user: TUser,
    @Body() { maxResults = 4 }: SuggestAspirationsDto
  ) {
    try {
      const suggestions =
        await this.roadmapGenerationService.suggestSimilarProfiles(
          user._id,
          maxResults
        );
      return suggestions;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Post('generate-with-target')
  async generateWithTarget(
    @AuthUser() user: TUser,
    @Body('targetUrl') targetUrl: string
  ): Promise<{ roadmap: Partial<Roadmap>; motivationLine?: string }> {
    return this.roadmapGenerationService.buildRoadmap(user, targetUrl);
  }

  @Post('select')
  async select(
    @AuthUser() user: TUser,
    @Body() body: { roadmap: Partial<Roadmap>; aspirationalLinkedinUrl: string }
  ): Promise<Roadmap> {
    try {
      const savedRoadmap = await this.roadmapService.createRoadmap({
        ...body.roadmap,
        userId: user._id,
        goalJob: body.roadmap.goalJob ?? '',
        milestones: body.roadmap.milestones ?? [],
        isApproved: true,
      });

      this.roadmapGenerationService.clearUserCache(user._id);

      await this.usersRepository.update(user._id, {
        aspirationalLinkedinUrl: body.aspirationalLinkedinUrl,
        isRoadmapGenerated: true,
      });

      return savedRoadmap;
    } catch (error) {
      this.logger.error('[POST /select] Error:', error);
      throw error;
    }
  }

  @Get()
  async get(@AuthUser() user: TUser): Promise<Roadmap | null> {
    try {
      const roadmap = await this.roadmapService.getRoadmapByUserId(user._id);
      return roadmap;
    } catch (error) {
      this.logger.error('[GET /roadmap] Error:', error);
      throw error;
    }
  }
}

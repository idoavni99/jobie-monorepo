import { AuthUser } from '@jobie/auth-core';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types';
import { HttpService } from '@nestjs/axios';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
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
  ) { }

  @Post('suggest-aspirations')
  async suggest(
    @AuthUser() user: TUser,
    @Body() { targetUrl, maxResults = 4 }: SuggestAspirationsDto
  ) {
    // fallback to DB if targetUrl is not in request
    const finalUrl =
      targetUrl?.trim() ||
      (await this.roadmapGenerationService.getAspirationalUrlFromUser(
        user._id
      ));

    if (!finalUrl) {
      this.logger.warn(
        '[POST /suggest-aspirations] No targetUrl in body or DB'
      );
      throw new Error('targetUrl is required');
    }

    try {
      const suggestions =
        await this.roadmapGenerationService.suggestSimilarProfiles(
          finalUrl,
          maxResults
        );
      return suggestions;
    } catch (error) {
      this.logger.error('[POST /suggest-aspirations] Error:', error);
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

      //Generate milestones after saving the roadmap
      const initialMilestones = savedRoadmap.milestones.slice(0, 3);
      await firstValueFrom(
        this.httpService.post('/initialGenerate', initialMilestones)
      );

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

  @Post('regenerate')
  async regenerateRoadmap(@AuthUser() user: TUser,): Promise<Roadmap | null> {
    try {
      const roadmap = await this.roadmapService.getRoadmapByUserId(user._id);
      if (!roadmap) {
        throw new Error("Roadmap not found for user");
      }
      const regeneratedRoadmap = await this.roadmapGenerationService.regenerateRoadmap(roadmap, user);
      return regeneratedRoadmap;

    } catch (error) {
      this.logger.error('[GET /roadmap] Error:', error);
      throw error;
    }


  }
}

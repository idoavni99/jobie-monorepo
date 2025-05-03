import { AuthUser } from '@jobie/auth-core';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { UsersRepository } from '@jobie/users/nestjs';
import { TUser } from '@jobie/users/types';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { SuggestAspirationsDto } from './dto';
import { RoadmapGenerationService } from './roadmap-generation.service';

@Controller()
export class RoadmapController {
  constructor(
    private readonly roadmapGenerationService: RoadmapGenerationService,
    private readonly roadmapService: RoadmapService,
    private readonly usersRepository: UsersRepository,
  ) { }

  @Post('suggest-aspirations')
  async suggest(
    @AuthUser() user: TUser,
    @Body() { targetUrl, maxResults = 4 }: SuggestAspirationsDto
  ) {
    console.log('[POST /suggest-aspirations] incoming targetUrl:', targetUrl, 'maxResults:', maxResults);

    // fallback to DB if targetUrl is not in request
    const finalUrl =
      targetUrl?.trim() ||
      (await this.roadmapGenerationService.getAspirationalUrlFromUser(user._id));


    if (!finalUrl) {
      console.warn('[POST /suggest-aspirations] No targetUrl in body or DB');
      throw new Error('targetUrl is required');
    }

    try {
      const suggestions = await this.roadmapGenerationService.suggestSimilarProfiles(finalUrl, maxResults);
      console.log('[POST /suggest-aspirations] suggestions result:', suggestions);
      return suggestions;
    } catch (error) {
      console.error('[POST /suggest-aspirations] Error:', error);
      throw error;
    }
  }


  @Post('generate-with-target')
  async generateWithTarget(
    @AuthUser() user: TUser,
    @Body('targetUrl') targetUrl: string,
  ): Promise<Partial<Roadmap>> {
    console.log('[POST /generate-with-target] userId:', user._id, 'targetUrl:', targetUrl);
    try {
      const roadmap = await this.roadmapGenerationService.buildRoadmap(user, targetUrl);
      console.log('[POST /generate-with-target] roadmap generated:', roadmap);
      return roadmap;
    } catch (error) {
      console.error('[POST /generate-with-target] Error:', error);
      throw error;
    }
  }

  @Post('select')
  async select(
    @AuthUser() user: TUser,
    @Body() body: { roadmap: Partial<Roadmap>; aspirationalLinkedinUrl: string }
  ): Promise<Roadmap> {
    console.log('[POST /select] userId:', user._id, 'aspirationalLinkedinUrl:', body.aspirationalLinkedinUrl);
    try {
      const savedRoadmap = await this.roadmapService.createRoadmap({
        ...body.roadmap,
        userId: user._id,
        isApproved: true,
      });
      console.log('[POST /select] savedRoadmap:', savedRoadmap);

      await this.usersRepository.update(user._id, {
        aspirationalLinkedinUrl: body.aspirationalLinkedinUrl,
      });
      console.log('[POST /select] user updated with aspirational URL');

      return savedRoadmap;
    } catch (error) {
      console.error('[POST /select] Error:', error);
      throw error;
    }
  }

  @Get()
  async get(@AuthUser() user: TUser): Promise<Roadmap | null> {
    console.log('[GET /roadmap] userId:', user._id);
    try {
      const roadmap = await this.roadmapService.getRoadmapByUserId(user._id);
      console.log('[GET /roadmap] fetched roadmap:', roadmap);
      return roadmap;
    } catch (error) {
      console.error('[GET /roadmap] Error:', error);
      throw error;
    }
  }
}

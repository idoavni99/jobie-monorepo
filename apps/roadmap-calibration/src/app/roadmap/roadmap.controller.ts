import { AuthUser } from '@jobie/auth-core';
import { Roadmap, RoadmapService } from '@jobie/roadmap/nestjs';
import { UsersRepository } from '@jobie/users/nestjs';
import { EnrichedProfileUpdateData, TUser } from '@jobie/users/types';
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
  ) { }

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

  /**
   * Regenerates the user's roadmap based on their enriched profile data.
   * 
   * This method retrieves the existing roadmap for the user, validates its existence,
   * and regenerates it using the provided enriched profile data. The regenerated roadmap
   * includes updated milestones and completed skills.
   * 
   * @param user - The authenticated user requesting the regeneration.
   * @param body - The request body containing the enriched profile data.
   
   * @throws An error if the roadmap is not found or if the regeneration process fails.
   */
  @Post('regenerate')
  async regenerateRoadmap(@AuthUser() user: TUser,@Body() body:{enrichedProfile: EnrichedProfileUpdateData}) {
    try { // Req. 5.1
      const roadmap = await this.roadmapService.getRoadmapByUserId(user._id);
      if (!roadmap) {
        throw new Error("Roadmap not found for user");
      }
    
      await this.roadmapGenerationService.regenerateRoadmap(roadmap, user,body.enrichedProfile );
      

    } catch (error) {
      this.logger.error('[POST /regenerate] Error:', error);
      
      throw error;
    }


  }
}

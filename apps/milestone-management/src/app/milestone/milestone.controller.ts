import { AuthUser } from '@jobie/auth-core';
import { Milestone, MilestoneService } from '@jobie/milestone/nestjs';
import { RoadmapMilestone } from '@jobie/roadmap/types';
import { TUser } from '@jobie/users/types';
import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ToggleStepDto } from './dtos/toggle-step.dto';
import { MilestoneGenerationService } from './milestone-generation.service';
@Controller()
export class MilestoneController {
  constructor(
    private readonly milestoneGenerationService: MilestoneGenerationService,
    private readonly milestoneService: MilestoneService
  ) {}
  @Post('initial-generate')
  async initalGenerate(
    @Body() roadmapMilestones: RoadmapMilestone | RoadmapMilestone[]
  ): Promise<Milestone | Milestone[]> {
    // check if the input is an array or a single milestone object

    const items = Array.isArray(roadmapMilestones)
      ? roadmapMilestones
      : [roadmapMilestones];

    // generate each milestone & save it to milestones DB
    const results =
      await this.milestoneGenerationService.generateMultipleMilestones(items);

    return this.milestoneService.createMultipleMilestones(results);
  }

  @Get('')
  async get(
    @Query('milestoneId') milestoneId: string
  ): Promise<Milestone | undefined> {
    const milestone = await this.milestoneService.getMilestoneById(milestoneId);
    return milestone;
  }

  @Delete('')
  async deleteAll(@AuthUser() { _id }: TUser) {
    await this.milestoneService.deleteByUserId(_id);
  }

  @Get('batch')
  async getMilestonesByIds(
    @Query('ids') milestoneIds: string
  ): Promise<Milestone[]> {
    return this.milestoneService.getMilestonesByIds(milestoneIds);
  }

  @Patch('toggleStep')
  async toggleStep(@Body() dto: ToggleStepDto): Promise<Milestone> {
    return this.milestoneService.toggleStep(
      dto.milestoneId,
      dto.stepId,
      dto.completed
    );
  }
  @Post('generateNext')
  async generateNext(
    @AuthUser() user: TUser,
    @Body() dto: { CurrentMilestoneId: string }
  ): Promise<Milestone> {
    // first check if its already generated
    const current_milestone = await this.milestoneService.getMilestoneById(
      dto.CurrentMilestoneId
    );
    if (!current_milestone) {
      throw new NotFoundException('Milestone not found');
    }
    if (current_milestone.hasGeneratedNext) {
      throw new ConflictException('Next milestone already generated');
    }

    // Set current Roadmap's milestone status to "completed"
    await this.milestoneService.updateRoadmapMilestoneStatus(
      user._id,
      current_milestone._id,
      'completed'
    );

    // Set next Roadmap's milestone status to "active"
    const next = await this.milestoneService.activateNextRoadmapMilestone(
      user._id
    );

    // Generate the next milestone
    const generated = await this.milestoneGenerationService.generateMilestone(
      next
    );

    // Save the generated milestone to DB
    const saved = await this.milestoneService.createMilestone(generated);

    // Update the current milestone to have generated next milestone
    await this.milestoneService.markAsGeneratedNext(current_milestone._id);
    return saved;
  }
}

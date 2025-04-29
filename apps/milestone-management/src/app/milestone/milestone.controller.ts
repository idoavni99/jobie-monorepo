import { Milestone, MilestoneService } from '@jobie/milestone/nestjs';
import { Body, Controller, Patch, Post } from '@nestjs/common';
import { GenerateMilestoneDto } from './dtos/generate-milestone.dto';
import { ToggleStepDto } from './dtos/toggle-step.dto';
import { MilestoneGenerationService } from './milestone-generation.service';

@Controller()
export class MilestoneController {
  constructor(
    private readonly milestoneGenerationService: MilestoneGenerationService,
    private readonly milestoneService: MilestoneService
  ) {}
  @Post('generateMilestone')
  async generateMilestone(
    @Body() dto: GenerateMilestoneDto
  ): Promise<Milestone> {
    const milestone = await this.milestoneGenerationService.generateMilestone(
      dto
    );
    return this.milestoneService.createMilestone(milestone);
  }
  // get milestone according to milestone id
  @Post('getMilestone')
  async getMilestone(@Body() dto: { milestoneId: string }): Promise<Milestone> {
    const milestone = await this.milestoneService.getMilestone(dto.milestoneId);
    return milestone;
  }

  @Patch('toggleStep')
  async toggleStep(@Body() dto: ToggleStepDto): Promise<Milestone> {
    return this.milestoneService.toggleStep(
      dto.milestoneId,
      dto.stepId,
      dto.completed
    );
  }
}

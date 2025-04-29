import { Milestone, MilestoneService } from '@jobie/milestone/nestjs';
import { Body, Controller, Post } from '@nestjs/common';
import { GenerateMilestoneDto } from './dtos/generate-milestone.dto';
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
  ): Promise<Milestone | any> {
    const milestone = await this.milestoneGenerationService.generateMilestone(
      dto
    );
    return this.milestoneService.saveMilestone(milestone);
  }
}

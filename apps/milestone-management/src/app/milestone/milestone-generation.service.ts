import { Milestone } from '@jobie/milestone/nestjs';
import { OpenAIRepository } from '@jobie/openai';
import { Injectable } from '@nestjs/common';
import { GenerateMilestoneDto } from './dtos/generate-milestone.dto';

@Injectable()
export class MilestoneGenerationService {
  constructor(private readonly openAiRepository: OpenAIRepository) {}
  async generateMilestone(
    dto: GenerateMilestoneDto
  ): Promise<Partial<Milestone>> {
    const prompt = `
    The user is working towards achieving the milestone: "${dto.milestone_name}"

    These skills will be acquired in this milestone: ${dto.skills.join(', ')}

    Provide a structured breakdown with actionable steps to complete this milestone.
    Each step should be approximately 10 words and no more than 5 steps in total.
    Format the response as JSON: {"steps": [{"step": "description", "completed": false}, ...]}
    `;

    const parsed = await this.openAiRepository.requestPromptJSON<{
      steps: { step: string; completed: boolean }[];
    }>(
      'You are a career mentor guiding a user through their career roadmap.',
      prompt
    );

    const steps = Array.isArray(parsed?.steps) ? parsed.steps : [];

    return {
      _id: dto._id,
      userId: dto.userId,
      milestone_name: dto.milestone_name,
      skills: dto.skills,
      steps,
      completed: false,
    };
  }
}

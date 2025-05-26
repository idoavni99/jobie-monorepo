import { TMilestone } from '@jobie/milestone/types';
import { OpenAIRepository } from '@jobie/openai';
import { RoadmapMilestone } from '@jobie/roadmap/types';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MilestoneGenerationService {
  constructor(private readonly openAiRepository: OpenAIRepository) {}
  async generateMilestone(
    roadmapMilestone: RoadmapMilestone
  ): Promise<TMilestone> {
    const prompt = `
    The user is working towards achieving the milestone: "${
      roadmapMilestone.milestoneName
    }"

    These skills will be acquired in this milestone: ${roadmapMilestone.skills.join(
      ', '
    )}

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

    // add _id to each step
    parsed.steps = parsed.steps.map((step) => ({
      ...step,
      _id: crypto.randomUUID(),
    }));

    return {
      _id: roadmapMilestone._id,
      milestoneName: roadmapMilestone.milestoneName,
      skills: roadmapMilestone.skills,
      steps: parsed.steps,
      status: roadmapMilestone.status,
      hasGeneratedNext: false,
    } as TMilestone;
  }
}

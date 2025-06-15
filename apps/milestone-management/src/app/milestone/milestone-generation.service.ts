import { TMilestone } from '@jobie/milestone/types';
import { OpenAIRepository } from '@jobie/openai';
import { RoadmapMilestone } from '@jobie/roadmap/types';
import { Injectable, Logger } from '@nestjs/common';
@Injectable()
export class MilestoneGenerationService {
  private readonly logger = new Logger(MilestoneGenerationService.name);

  constructor(private readonly openAiRepository: OpenAIRepository) {}
  async generateMultipleMilestones(roadmapMilestones: RoadmapMilestone[]) {
    const prompt = `
      You will be given an array of milestone prompts to generate, and in the end you'll receive the expected structure.

      ${roadmapMilestones
        .map((milestone) => this.getMilestonePromptDescription(milestone))
        .join('\n')}

      ${this.getMilestoneGenerationInstructions()} 
      A milestone output JSON is as such: {'milestoneName': '', 'steps': [{'step': '', 'completed': false}, ...]}
      Ensure to make the output an array in the same order as the input, and that all milestones have valid URLs in their steps.
    `;

    const milestones = await this.openAiRepository.requestPromptJSON<
      TMilestone[]
    >(
      'You are a career mentor guiding a user through their career roadmap.',
      prompt
    );

    return milestones.map((milestone, index) => ({
      ...milestone,
      _id: roadmapMilestones[index]._id,
      steps: milestone.steps.map((step) => ({
        ...step,
        _id: crypto.randomUUID(),
      })),
      hasGeneratedNext: index < 2,
    }));
  }

  async generateMilestone(
    roadmapMilestone: RoadmapMilestone
  ): Promise<TMilestone> {
    const parsed = await this.openAiRepository.requestPromptJSON<{
      steps: { step: string; completed: boolean }[];
    }>(
      'You are a career mentor guiding a user through their career roadmap.',
      `
      ${this.getMilestonePromptDescription(roadmapMilestone)}
      ${this.getMilestoneGenerationInstructions()}
      `
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

  private getMilestonePromptDescription(roadmapMilestone: RoadmapMilestone) {
    return `
    The user is working towards achieving the milestone: "${
      roadmapMilestone.milestoneName
    }"

    These skills will be acquired in this milestone: ${roadmapMilestone.skills.join(
      ', '
    )}
    `;
  }

  private getMilestoneGenerationInstructions() {
    return `
    
    Provide a structured breakdown with actionable steps to complete this milestone.
    Each step should be approximately 60 to 80 words and no more than 5 steps in total.
    Each step should be a single line (3 senetences), and include a real URL (guide, exercise, online course - udemy or coursera etc, or resource) that is in a new line. Ensure the URL works (not 404 and indeed works).
    Format the response as JSON: {"steps": [{"step": "description", "completed": false}, ...]}`;
  }
}

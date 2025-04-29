import { Injectable } from '@nestjs/common';
import { MilestoneRepository } from './milestone.repository';
import { Milestone } from './milestone.schema';

@Injectable()
export class MilestoneService {
  constructor(private readonly milestoneRepository: MilestoneRepository) {}

  async createMilestone(milestone: Partial<Milestone>): Promise<Milestone> {
    return this.milestoneRepository.create(milestone);
  }
  async getMilestone(milestoneId: string): Promise<Milestone> {
    return this.milestoneRepository.getById(milestoneId);
  }
  async toggleStep(
    milestoneId: string,
    stepId: string,
    completed: boolean
  ): Promise<Milestone> {
    return await this.milestoneRepository.updateStepCompletion(
      milestoneId,
      stepId,
      completed
    );
  }

  async deleteUserMilestone(userId: string) {
    return this.milestoneRepository.deleteByUserId(userId);
  }
}

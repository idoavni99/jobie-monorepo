import { Injectable } from '@nestjs/common';
import { Milestone, MilestoneRepository } from './index';

@Injectable()
export class MilestoneService {
  constructor(private readonly milestoneRepository: MilestoneRepository) {}

  async saveMilestome(milestone: Milestone): Promise<Milestone> {
    return this.milestoneRepository.upsert(milestone);
  }

  async deleteUserMilestone(userId: string) {
    return this.milestoneRepository.deleteByUserId(userId);
  }

  async getMiletonesByUserId(userId: string): Promise<Milestone[] | null> {
    return this.milestoneRepository.findByUserId(userId);
  }
}

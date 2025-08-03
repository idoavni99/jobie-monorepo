import { RoadmapRepository } from '@jobie/roadmap/nestjs';
import { RoadmapMilestone } from '@jobie/roadmap/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TMilestone } from '../types';
import { MilestoneRepository } from './milestone.repository';
import { Milestone } from './milestone.schema';

@Injectable()
export class MilestoneService {
  constructor(
    private readonly milestoneRepository: MilestoneRepository,
    private readonly roadmapRepository: RoadmapRepository
  ) {}

  async createMilestone(milestone: TMilestone): Promise<Milestone> {
    return this.milestoneRepository.create(milestone);
  }

  async createMultipleMilestones(
    milestones: TMilestone[]
  ): Promise<Milestone[]> {
    return this.milestoneRepository.createMany(milestones);
  }

  async getMilestoneById(milestoneId: string): Promise<Milestone | undefined> {
    return this.milestoneRepository.findById(milestoneId);
  }
  async getMilestonesByIds(milestoneIds: string): Promise<Milestone[]> {
    return this.milestoneRepository.findByIds(milestoneIds);
  }

  async deleteByUserId(userId: string) {
    return this.milestoneRepository.deleteByUserId(userId);
  }

  async toggleStep(
    milestoneId: string,
    stepId: string,
    completed: boolean
  ): Promise<Milestone> {
    const milestone = await this.milestoneRepository.updateStepCompletion(
      milestoneId,
      stepId,
      completed
    );
    return milestone;
  }

  async updateRoadmapMilestoneStatus(
    userId: string,
    milestoneId: string,
    status: 'active' | 'summary' | 'completed'
  ): Promise<void> {
    const roadmap = await this.roadmapRepository.findByUserId(userId);
    if (!roadmap) throw new NotFoundException('Roadmap not found');

    const milestone = roadmap.milestones.find((m) => m._id === milestoneId);
    if (!milestone) throw new NotFoundException('Milestone not found');

    // update the status of the milestone in the roadmap
    milestone.status = status;
    await this.roadmapRepository.save(roadmap);
  }

  async activateNextRoadmapMilestone(
    userId: string
  ): Promise<RoadmapMilestone> {
    const roadmap = await this.roadmapRepository.findByUserId(userId);
    if (!roadmap) throw new NotFoundException('Roadmap not found');

    const next = roadmap.milestones.find((m) => m.status === 'summary');
    if (!next) throw new NotFoundException('No next milestone to activate');

    await this.updateRoadmapMilestoneStatus(userId, next._id, 'active');
    return next;
  }
  async markAsGeneratedNext(milestoneId: string): Promise<RoadmapMilestone> {
    return this.milestoneRepository.markAsGeneratedNext(milestoneId);
  }
}

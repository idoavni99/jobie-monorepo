import { Roadmap, RoadmapRepository } from '@jobie/roadmap-calibration';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoadmapService {
    constructor(private readonly roadmapRepository: RoadmapRepository) { }

    async generateInitialRoadmap(userId: string, summarizedMilestones: string[]): Promise<Roadmap> {
        return this.roadmapRepository.create({
            userId,
            summarizedMilestones,
            milestoneIds: [],
            isApproved: false,
        });
    }

    async approveRoadmap(userId: string): Promise<Roadmap | null> {
        return this.roadmapRepository.approveRoadmap(userId);
    }

    async getRoadmapByUserId(userId: string): Promise<Roadmap | null> {
        return this.roadmapRepository.findByUserId(userId);
    }

    async updateMilestones(userId: string, titles: string[], ids: string[]): Promise<Roadmap | null> {
        return this.roadmapRepository.updateMilestones(userId, titles, ids);
    }
}

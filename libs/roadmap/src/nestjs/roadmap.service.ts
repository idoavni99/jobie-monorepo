import { Injectable } from '@nestjs/common';
import { RoadmapRepository } from './roadmap.repository';
import { Roadmap } from './roadmap.schema';
@Injectable()
export class RoadmapService {
  constructor(private readonly roadmapRepository: RoadmapRepository) {}

  async saveRoadmap(roadmap: Partial<Roadmap>): Promise<Roadmap> {
    return this.roadmapRepository.upsert(roadmap);
  }

  async deleteUserRoadmap(userId: string) {
    return this.roadmapRepository.deleteByUserId(userId);
  }

  async approveRoadmap(userId: string): Promise<Roadmap | null> {
    return this.roadmapRepository.approveRoadmap(userId);
  }

  async getRoadmapByUserId(userId: string): Promise<Roadmap | null> {
    return this.roadmapRepository.findByUserId(userId);
  }

  async updateMilestones(
    userId: string,
    titles: string[],
    ids: string[]
  ): Promise<Roadmap | null> {
    return this.roadmapRepository.updateMilestones(userId, titles, ids);
  }
}

import { Injectable } from '@nestjs/common';
import { RoadmapRepository } from './roadmap.repository';
import { Roadmap } from './roadmap.schema';

@Injectable()
export class RoadmapService {
  constructor(private readonly roadmapRepository: RoadmapRepository) { }

  async createRoadmap(roadmap: Partial<Roadmap>): Promise<Roadmap> {
    return this.roadmapRepository.create(roadmap);
  }

  async getRoadmapByUserId(userId: string): Promise<Roadmap | null> {
    return this.roadmapRepository.findByUserId(userId);
  }

  // Optional: keep if you want reset feature
  async deleteUserRoadmap(userId: string) {
    return this.roadmapRepository.deleteByUserId(userId);
  }

}

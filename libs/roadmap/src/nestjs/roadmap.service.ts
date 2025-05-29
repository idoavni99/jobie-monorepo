import { Injectable } from '@nestjs/common';
import { TRoadmap } from '../types';
import { RoadmapRepository } from './roadmap.repository';
import { Roadmap } from './roadmap.schema';

@Injectable()
export class RoadmapService {
  constructor(private readonly roadmapRepository: RoadmapRepository) {}

  async createRoadmap(roadmap: TRoadmap): Promise<Roadmap> {
    return this.roadmapRepository.create(roadmap);
  }

  async getRoadmapByUserId(userId: string): Promise<Roadmap | null> {
    return this.roadmapRepository.findByUserId(userId);
  }

  async deleteUserRoadmap(userId: string) {
    return this.roadmapRepository.deleteByUserId(userId);
  }
}

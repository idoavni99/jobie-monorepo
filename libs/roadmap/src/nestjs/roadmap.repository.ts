import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { TRoadmap } from '../types';
import { Roadmap, RoadmapDocument } from './roadmap.schema';

@Injectable()
export class RoadmapRepository {
  constructor(
    @InjectModel(Roadmap.name)
    private readonly roadmapModel: Model<RoadmapDocument>
  ) {}

  async create(roadmap: TRoadmap): Promise<Roadmap> {
    const createdRoadmap = await this.roadmapModel.create(
      Object.assign(roadmap, { _id: randomUUID() })
    );
    return createdRoadmap?.toObject();
  }
  async save(roadmap: Roadmap): Promise<Roadmap | undefined> {
    const updatedRoadmap = await this.roadmapModel
      .findByIdAndUpdate(roadmap._id, roadmap, { new: true })
      .exec();
    return updatedRoadmap?.toObject();
  }

  async findByUserId(userId: string): Promise<Roadmap | null> {
    return this.roadmapModel.findOne({ userId }).exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.roadmapModel.deleteMany({ userId });
  }

  async approveRoadmap(userId: string): Promise<Roadmap | null> {
    return this.roadmapModel
      .findOneAndUpdate({ userId }, { isApproved: true }, { new: true })
      .exec();
  }
  async markMilestoneAsCompleted(
    userId: string,
    milestoneId: string
  ): Promise<void> {
    await this.roadmapModel.updateOne(
      { userId, 'milestones._id': milestoneId },
      { $set: { 'milestones.$.status': 'completed' } }
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Roadmap, RoadmapDocument } from './roadmap.schema';

@Injectable()
export class RoadmapRepository {
  constructor(
    @InjectModel(Roadmap.name)
    private readonly roadmapModel: Model<RoadmapDocument>
  ) {}

  async create(roadmap: Partial<Roadmap>): Promise<Roadmap> {
    const createdRoadmap = await this.roadmapModel.create(
      Object.assign(roadmap, { _id: randomUUID() })
    );
    return createdRoadmap?.toObject();
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

  async updateMilestones(
    userId: string,
    titles: string[],
    ids: string[]
  ): Promise<Roadmap | null> {
    return this.roadmapModel
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            summarizedMilestones: titles,
            milestoneIds: ids,
          },
        },
        { new: true }
      )
      .exec();
  }
}

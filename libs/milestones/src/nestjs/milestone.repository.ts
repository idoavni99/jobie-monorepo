import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Milestone, MilestoneDocument } from './milestone.schema';

@Injectable()
export class MilestoneRepository {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>
  ) {}

  async upsert(milestone: Partial<Milestone>): Promise<Milestone> {
    const created = new this.milestoneModel(milestone);
    return created.save();
  }

  async findByUserId(userId: string): Promise<Milestone[] | null> {
    return this.milestoneModel.find({ userId }).exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.milestoneModel.deleteMany({ userId });
  }
}

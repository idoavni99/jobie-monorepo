import { HttpException, Injectable } from '@nestjs/common';
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
    try {
      const createdMilestone = await this.milestoneModel.create(
        Object.assign(milestone, { _id: milestone._id })
      );
      return createdMilestone?.toObject();
    } catch (error: any) {
      console.error('Error inserting milestone:', error);

      throw new HttpException(
        {
          message: `Failed to create milestone: ${error.message}`,
          error: error.name,
        },
        500
      );
    }
  }

  async findByUserId(userId: string): Promise<Milestone[] | null> {
    return this.milestoneModel.find({ userId }).exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.milestoneModel.deleteMany({ userId });
  }
}

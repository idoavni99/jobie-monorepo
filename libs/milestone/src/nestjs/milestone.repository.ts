import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { Milestone, MilestoneDocument } from './milestone.schema';

@Injectable()
export class MilestoneRepository {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>
  ) {}

  async create(milestone: Partial<Milestone>): Promise<Milestone> {
    try {
      const createdMilestone = await this.milestoneModel.create(
        // assign id for each of the milestone steps
        Object.assign(milestone, {
          steps: milestone.steps?.map((step) => ({
            ...step,
            _id: randomUUID(),
          })),
        })
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
  // get milestone according to milestone id
  async getById(milestoneId: string): Promise<Milestone> {
    const milestone = await this.milestoneModel.findById(milestoneId);
    if (!milestone) {
      throw new HttpException(
        {
          message: `Milestone with id ${milestoneId} not found`,
          error: 'NotFound',
        },
        404
      );
    }
    return milestone.toObject();
  }

  async updateStepCompletion(
    milestoneId: string,
    stepId: string,
    completed: boolean
  ): Promise<Milestone> {
    // update the step's "completed" field

    const result = await this.milestoneModel.updateOne(
      { _id: milestoneId, 'steps._id': stepId },
      { $set: { 'steps.$.completed': completed } }
    );

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Step or milestone not found');
    }

    // update the milestone's "completed" field if needed (if all steps are completed)

    const milestone = await this.milestoneModel.findById(milestoneId);
    if (!milestone) {
      throw new NotFoundException('Milestone not found after update');
    }

    const allDone = milestone.steps.every((s) => s.completed);

    if (milestone.completed !== allDone) {
      milestone.completed = allDone;
      await milestone.save();
    }

    return milestone;
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.milestoneModel.deleteMany({ userId });
  }
}

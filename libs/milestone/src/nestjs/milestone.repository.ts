import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TMilestone } from '../types';
import { Milestone, MilestoneDocument } from './milestone.schema';

@Injectable()
export class MilestoneRepository {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>
  ) {}

  async create(milestone: TMilestone): Promise<Milestone> {
    const createdMilestone = await this.milestoneModel.create(milestone);
    return createdMilestone?.toObject();
  }

  async createMany(milestones: TMilestone[]): Promise<Milestone[]> {
    const createdMilestones = await this.milestoneModel.insertMany(milestones);
    return createdMilestones.map((milestone) => milestone.toObject());
  }

  async findById(milestoneId: string): Promise<Milestone | undefined> {
    const milestone = await this.milestoneModel.findById(milestoneId);
    return milestone?.toObject();
  }
  async findByIds(milestoneIds: string): Promise<Milestone[]> {
    const idsArray = milestoneIds.split(','); // convert the string to an array
    const milestones = await this.milestoneModel.find({
      _id: { $in: idsArray },
    });
    return milestones.map((milestone) => milestone.toObject());
  }
  async findAll(): Promise<Milestone[]> {
    return this.milestoneModel.find();
  }

  async updateStepCompletion(
    milestoneId: string,
    stepId: string,
    completed: boolean
  ): Promise<Milestone> {
    // update the step's "completed" field
    await this.milestoneModel.updateOne(
      { _id: milestoneId, 'steps._id': stepId },
      { $set: { 'steps.$.completed': completed } }
    );

    // update the milestone's status field

    const milestone = await this.milestoneModel.findById(milestoneId);
    if (!milestone) {
      throw new NotFoundException(`Milestone with id ${milestoneId} not found`);
    }

    milestone.status = milestone.steps.every((s) => s.completed)
      ? 'completed'
      : 'active';

    await milestone.save();

    return milestone.toObject();
  }

  async markAsGeneratedNext(milestoneId: string): Promise<Milestone> {
    // update the milestoness hasGeneratedNext field
    const milestone = await this.milestoneModel.findById(milestoneId);
    if (!milestone) {
      throw new NotFoundException(`Milestone with id ${milestoneId} not found`);
    }

    milestone.hasGeneratedNext = true;
    await milestone.save();

    return milestone.toObject();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.milestoneModel.deleteMany({ userId });
  }
}

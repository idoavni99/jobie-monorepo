import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MilestoneWithSkills } from '../types/roadmap.type';

export type RoadmapDocument = HydratedDocument<Roadmap>;

@Schema({
  toJSON: {
    virtuals: true,
    getters: true,
  },
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class Roadmap {
  @Prop({ required: true })
  userId: string;

  @Prop()
  goalJob: string;

  // רק שמות של milestones – לשימושים פשוטים
  @Prop({ type: [String], default: [] })
  summarizedMilestones: string[];

  // כל milestone עם הסקילס שלו
  @Prop({
    type: [
      {
        milestone_name: { type: String, required: true },
        skills: [{ type: String }],
      },
    ],
    default: [],
  })
  milestonesWithSkills: MilestoneWithSkills[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Milestone',
    default: [],
  })
  milestoneIds: mongoose.Types.ObjectId[];

  @Prop({ default: false })
  isApproved: boolean;
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);

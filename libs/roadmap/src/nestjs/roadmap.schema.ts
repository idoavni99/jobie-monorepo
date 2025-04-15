import { DataEntity, defaultSchemaOptions } from '@jobie/data-entities-core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MilestoneWithSkills, TRoadmap } from '../types/roadmap.type';

export type RoadmapDocument = HydratedDocument<Roadmap>;
type RoadmapEntity = TRoadmap & DataEntity;
@Schema(defaultSchemaOptions)
export class Roadmap implements RoadmapEntity {
  @Prop()
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

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
  milestoneIds: string[];

  @Prop({ default: false })
  isApproved: boolean;
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);

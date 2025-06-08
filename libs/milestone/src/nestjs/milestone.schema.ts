import { DataEntity, defaultSchemaOptions } from '@jobie/data-entities-core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TMilestone } from '../types';

export type MilestoneDocument = HydratedDocument<Milestone>;
type MilestoneEntity = TMilestone & DataEntity;
@Schema(defaultSchemaOptions)
export class Milestone implements MilestoneEntity {
  completed: boolean;
  @Prop({ required: true })
  _id: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ required: true })
  milestoneName: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({
    type: [
      {
        _id: String,
        step: String,
        completed: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  steps: { _id: string; step: string; completed: boolean }[];
  @Prop({
    type: String,
    enum: ['summary', 'active', 'completed'],
    default: 'active',
  })
  status: 'summary' | 'active' | 'completed';
  @Prop({ default: false })
  hasGeneratedNext: boolean;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);

import { DataEntity, defaultSchemaOptions } from '@jobie/data-entities-core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TMilestone } from '../types';

export type MilestoneDocument = HydratedDocument<Milestone>;
type MilestoneEntity = TMilestone & DataEntity;
@Schema(defaultSchemaOptions)
export class Milestone implements MilestoneEntity {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  milestoneName: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({
    type: [
      {
        step: String,
        completed: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  steps: { step: string; completed: boolean }[];

  @Prop({ default: false })
  completed: boolean;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);

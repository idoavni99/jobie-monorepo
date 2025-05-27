import { DataEntity, defaultSchemaOptions } from '@jobie/data-entities-core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoadmapMilestone, TRoadmap } from '../types/roadmap.type';

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

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  goalJob: string;

  @Prop({
    type: [
      {
        _id: String,
        milestoneName: { type: String, required: true },
        skills: [{ type: String }],
        status: {
          type: String,
          enum: ['summary', 'active', 'completed'],
          default: 'summary',
        },
      },
    ],
    default: [],
  })
  milestones: RoadmapMilestone[];

  @Prop({ default: false })
  isApproved: boolean;
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);

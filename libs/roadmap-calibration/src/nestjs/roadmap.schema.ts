import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

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

  @Prop({ type: [String], default: [] })
  summarizedMilestones: string[];

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

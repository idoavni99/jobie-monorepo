import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MilestoneDocument = HydratedDocument<Milestone>;

@Schema({ timestamps: true })
export class Milestone {
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

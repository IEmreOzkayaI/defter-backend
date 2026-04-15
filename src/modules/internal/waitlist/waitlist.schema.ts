import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'waitlist',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Waitlist {
  @Prop({ required: true, trim: true })
  full_name: string;

  @Prop({ required: true, trim: true })
  phone_number: string;

  @Prop({ required: true, trim: true })
  status: string;

  @Prop({ default: '', trim: true })
  note: string;

  created_at: Date;
  updated_at: Date;
}

export type WaitlistDocument = HydratedDocument<Waitlist>;
export const WaitlistSchema = SchemaFactory.createForClass(Waitlist);

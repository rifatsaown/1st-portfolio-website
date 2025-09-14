import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: Types.ObjectId;
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
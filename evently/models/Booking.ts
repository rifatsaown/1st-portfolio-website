import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  type: 'normal' | 'premium';
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  type: {
    type: String,
    enum: ['normal', 'premium'],
    required: true,
  },
}, {
  timestamps: true,
});

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
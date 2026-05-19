import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  banner: { type: String, required: true }, // URL to image
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  capacity: { type: Number, required: true, default: 100 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;

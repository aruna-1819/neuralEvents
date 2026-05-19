import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  eventId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewMessage: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;

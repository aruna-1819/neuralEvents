import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  qrCode: { type: String, required: true }, // base64 string or URL
  status: { type: String, enum: ['valid', 'used', 'cancelled'], default: 'valid' },
  paymentId: { type: String }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;

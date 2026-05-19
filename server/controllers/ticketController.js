import expressAsyncHandler from 'express-async-handler';
import Ticket from '../models/Ticket.js';
import QRCode from 'qrcode';

const createTicket = expressAsyncHandler(async (req, res) => {
  const { eventId, paymentId } = req.body;

  const qrData = JSON.stringify({ userId: req.user._id, eventId });
  const qrCodeImage = await QRCode.toDataURL(qrData);

  const ticket = new Ticket({
    user: req.user._id,
    event: eventId,
    qrCode: qrCodeImage,
    paymentId,
  });

  const createdTicket = await ticket.save();
  res.status(201).json(createdTicket);
});

const getMyTickets = expressAsyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user._id }).populate('event');
  res.json(tickets);
});

const verifyTicket = expressAsyncHandler(async (req, res) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);

  if (ticket) {
    if (ticket.status === 'valid') {
      ticket.status = 'used';
      await ticket.save();
      res.json({ message: 'Ticket verified successfully' });
    } else {
      res.status(400);
      throw new Error('Ticket has already been used or cancelled');
    }
  } else {
    res.status(404);
    throw new Error('Ticket not found');
  }
});

export { createTicket, getMyTickets, verifyTicket };

import expressAsyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

const getEvents = expressAsyncHandler(async (req, res) => {
  const events = await Event.find({});
  res.json(events);
});

const getEventById = expressAsyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

const createEvent = expressAsyncHandler(async (req, res) => {
  const { title, description, date, venue, banner, category, price, capacity } = req.body;

  const event = new Event({
    title,
    description,
    date,
    venue,
    banner,
    category,
    price,
    capacity,
    organizer: req.user._id
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

export { getEvents, getEventById, createEvent };

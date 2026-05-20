import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';
import Event from '../models/Event.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getUserWishlist = asyncHandler(async (req, res) => {
  const wishlistItems = await Wishlist.find({ user: req.user._id }).populate('event');
  
  // Return just the events, or empty array if none
  const events = wishlistItems.map(item => item.event).filter(Boolean);
  
  res.json(events);
});

// @desc    Toggle event in wishlist
// @route   POST /api/wishlist/:id
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if already in wishlist
  const existingWishlist = await Wishlist.findOne({ user: userId, event: eventId });

  if (existingWishlist) {
    // Remove from wishlist
    await existingWishlist.deleteOne();
    res.status(200).json({ message: 'Event removed from wishlist', added: false });
  } else {
    // Add to wishlist
    await Wishlist.create({
      user: userId,
      event: eventId,
    });
    res.status(201).json({ message: 'Event added to wishlist', added: true });
  }
});

export default { getUserWishlist, toggleWishlist };

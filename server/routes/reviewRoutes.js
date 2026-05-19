import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// @desc    Create a new event review
// @route   POST /api/reviews
// @access  Public (or Protect)
router.post('/', async (req, res) => {
  try {
    const { userId, eventId, userName, rating, reviewMessage, userAvatar } = req.body;

    if (!eventId || !userName || !rating || !reviewMessage) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const review = new Review({
      userId,
      eventId,
      userName,
      rating: Number(rating),
      reviewMessage,
      userAvatar: userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
      likes: 0
    });

    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to save review', error: error.message });
  }
});

// @desc    Get reviews for a specific event
// @route   GET /api/reviews/event/:eventId
// @access  Public
router.get('/event/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { sortBy } = req.query; // 'highest', 'latest', 'helpful'

    let sortOption = { createdAt: -1 }; // Default: Latest first
    if (sortBy === 'highest') {
      sortOption = { rating: -1, createdAt: -1 };
    } else if (sortBy === 'helpful') {
      sortOption = { likes: -1, createdAt: -1 };
    } else if (sortBy === 'latest') {
      sortOption = { createdAt: -1 };
    }

    const reviews = await Review.find({ eventId }).sort(sortOption);

    // Calculate rating breakdown & average
    let totalRating = 0;
    let starsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    reviews.forEach(r => {
      totalRating += r.rating;
      if (starsCount[r.rating] !== undefined) {
        starsCount[r.rating]++;
      }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : '0.0';

    res.json({
      reviews,
      stats: {
        averageRating,
        totalReviews,
        starsCount
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

// @desc    Increment helpful / like counter on a review
// @route   POST /api/reviews/:id/like
// @access  Public
router.post('/:id/like', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.likes += 1;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    console.error('Error liking review:', error);
    res.status(500).json({ message: 'Failed to like review', error: error.message });
  }
});

export default router;

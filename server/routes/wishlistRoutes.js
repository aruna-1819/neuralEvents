import express from 'express';
import wishlistController from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, wishlistController.getUserWishlist);

router.route('/:id')
  .post(protect, wishlistController.toggleWishlist);

export default router;

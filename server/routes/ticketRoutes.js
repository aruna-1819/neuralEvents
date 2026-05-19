import express from 'express';
const router = express.Router();
import {
  createTicket,
  getMyTickets,
  verifyTicket,
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createTicket);
router.route('/my-tickets').get(protect, getMyTickets);
router.route('/verify').post(protect, admin, verifyTicket);

export default router;

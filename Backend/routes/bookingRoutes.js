// 📁 backend/routes/bookingRoutes.js
import express from 'express';
import multer from 'multer';
import { createBooking, getAllBookings } from '../controllers/bookingController.js';

const router = express.Router();

// Optional: Setup multer if you plan to accept image uploads later (e.g., signature)
const upload = multer();

router.post('/', upload.none(), createBooking); // POST /api/bookings
router.get('/', getAllBookings); // GET /api/bookings (admin)

export default router;

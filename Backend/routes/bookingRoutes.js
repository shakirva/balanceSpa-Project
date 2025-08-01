import express from 'express';
import { createBooking, getAllBookings , updateAppointmentNotes, getAllUpdatedNotes} from '../controllers/bookingController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// ✅ Ensure uploads folder exists
const uploadDir = 'uploads/pdfs';
fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Setup multer to save PDF files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `booking-${Date.now()}-${Math.floor(Math.random() * 1e9)}.pdf`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ POST /api/bookings/create
router.post('/create', upload.single('pdf'), createBooking);

// ✅ GET /api/bookings
router.get('/', getAllBookings);

// 📁 routes/bookingRoutes.js
router.put('/:id/note', updateAppointmentNotes);
router.get('/notes/logs', getAllUpdatedNotes);



export default router;

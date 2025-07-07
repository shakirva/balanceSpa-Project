// 📁 backend/app.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Required for ESModules to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Enable CORS for frontend access
app.use(cors({
  origin: 'http://localhost:3000', // React frontend port
  credentials: true
}));

// ✅ Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Booking API
import bookingRoutes from './routes/bookingRoutes.js';
app.use('/api/bookings', bookingRoutes);

// ✅ Static React frontend build
app.use(express.static(path.join(__dirname, 'views')));

// ✅ Fallback: All unmatched routes handled by React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

export default app;

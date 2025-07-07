// Placeholder for routes/adminRoutes.js// routes/adminRoutes.js
import express from 'express';
import { loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin);

export default router;

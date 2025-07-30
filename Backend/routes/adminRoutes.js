// Placeholder for routes/adminRoutes.js// routes/adminRoutes.js
import express from 'express';
import { loginAdmin, getAdmins } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin);
  // Add this

router.get('/', getAdmins);

export default router;

import express from 'express';
import { getAllCustomers, addCustomer } from '../controllers/customerController.js';
const router = express.Router();

router.get('/', getAllCustomers);
router.post('/', addCustomer);

export default router;

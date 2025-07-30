import express from 'express';
import {
  getTreatments,
  addTreatment,
  updateTreatment,
  deleteTreatment,
} from '../controllers/treatmentController.js';
import upload from '../middlewares/multer.js'; // ✅ Image upload middleware

const router = express.Router();

// ✅ Fetch all treatments (grouped by category)
router.get('/', getTreatments);

// ✅ Add new treatment (with image upload)
router.post('/', upload.single('image'), addTreatment);

// ✅ Update existing treatment (with optional image update)
router.put('/:id', upload.single('image'), updateTreatment);

// ✅ Delete treatment
router.delete('/:id', deleteTreatment);

export default router;

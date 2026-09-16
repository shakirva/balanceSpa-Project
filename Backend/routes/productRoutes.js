import express from 'express';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

// ✅ Fetch all products (optionally filtered by ?category_id=)
router.get('/', getProducts);

// ✅ Add new product (with image upload)
router.post('/', upload.single('image'), addProduct);

// ✅ Update existing product (with optional image update)
router.put('/:id', upload.single('image'), updateProduct);

// ✅ Delete product
router.delete('/:id', deleteProduct);

export default router;

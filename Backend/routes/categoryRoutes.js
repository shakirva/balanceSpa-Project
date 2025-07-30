import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
const upload = multer({ storage });

// Routes
router.get('/', getCategories);
router.post('/', upload.single('image'), addCategory);
router.put('/:id', upload.single('image'), updateCategory);
router.delete('/:id', deleteCategory);


export default router;

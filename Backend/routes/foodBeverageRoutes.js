import express from 'express';
import controller from '../controllers/foodBeverageController.js';
import multer from '../middlewares/multer.js';

const router = express.Router();
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', multer.single('image'), controller.create);
router.put('/:id', multer.single('image'), controller.update);
router.delete('/:id', controller.delete);

export default router;

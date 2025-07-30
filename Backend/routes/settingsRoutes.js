// routes/settingsRoutes.js
import express from 'express';
import { upload, uploadVideo, getVideo } from '../controllers/settingsController.js';

const router = express.Router();

router.post('/upload-video', upload, uploadVideo);
router.get('/get-video', getVideo);

export default router;

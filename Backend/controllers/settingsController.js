// controllers/settingsController.js
import path from 'path';
import fs from 'fs';
import multer from 'multer';

const __dirname = path.resolve();

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/videos'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `welcome-video${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage }).single('video');

export const uploadVideo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const videoUrl = `/uploads/videos/${req.file.filename}`;
  return res.status(200).json({ success: true, url: videoUrl });
};

export const getVideo = (req, res) => {
  const videoPath = path.join(__dirname, 'uploads/videos/welcome-video.mp4');
  if (fs.existsSync(videoPath)) {
    return res.sendFile(videoPath);
  } else {
    return res.status(404).json({ success: false, message: 'Video not found' });
  }
};

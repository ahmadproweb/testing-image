const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    console.log('❌ No file received in request');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('📥 File received:', req.file);

  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlink(req.file.path, () => {});

    console.log('✅ Uploaded to Cloudinary:', result.secure_url);

    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

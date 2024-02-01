const express = require('express');
const router = express.Router();

const multer = require('multer');
const db = require('../config/db');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    );
  }
});

const upload = multer({ storage: storage });

// Endpoint for uploading an image
router.post('/images', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image was uploaded.');
  }

  // req.file contains information about the uploaded file
  // You can indeed get file_path, file_size, content_type, and other data from req.file
  try {
    // Example metadata from the uploaded file
    const { path, filename, mimetype, size } = req.file;

    // Insert metadata into the 'image_metadata' table
    // Assuming 'upload_date' can be set to the current timestamp in PostgreSQL
    // 'checksum' is not directly available from req.file; you would need additional logic to calculate it
    const { rows } = await db.query(
      'INSERT INTO image_metadata (file_path, image_name, content_type, file_size, upload_date) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
      [path, filename, mimetype, size]
    );
    console.log(req.file);
    console.log(req.body);
    res.json({
      message: 'Image uploaded successfully',
      file: {
        path,
        filename,
        mimetype,
        size
      },
      metadata: rows[0]
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Error uploading image');
  }
});

module.exports = router;

// Get images
router.get('/images', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM image_metadata');
    res.json(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

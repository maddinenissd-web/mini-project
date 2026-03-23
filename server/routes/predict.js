const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/dicom', 'image/bmp'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(jpg|jpeg|png|bmp|dcm)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, BMP, DICOM) are allowed'), false);
    }
  }
});

// POST /api/predict - Upload X-ray image for prediction
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';
    
    // Forward image to ML service
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000,
    });

    res.json({
      prediction: mlResponse.data.prediction,
      confidence: mlResponse.data.confidence,
      details: mlResponse.data.details || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Prediction error:', error.message);
    
    // If ML service is unavailable, return a helpful error
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'ML prediction service is currently unavailable',
        details: 'The pneumonia detection model service is not running. Please ensure the ML service is started.'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to process prediction', 
      details: error.message 
    });
  }
});

module.exports = router;

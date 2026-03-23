const express = require('express');
const router = express.Router();
const { analyzeLabReport } = require('../utils/gemini');

// POST /api/analyze - Analyze lab reports
router.post('/', async (req, res) => {
  try {
    const { reportData, patientContext } = req.body;

    if (!reportData) {
      return res.status(400).json({ error: 'Report data is required' });
    }

    const analysis = await analyzeLabReport(reportData, patientContext);
    res.json({ analysis, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze report', 
      details: error.message 
    });
  }
});

module.exports = router;

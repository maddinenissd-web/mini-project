const express = require('express');
const router = express.Router();
const { getMedicalResponse } = require('../utils/gemini');

// POST /api/chat - Send message to medical AI
router.post('/', async (req, res) => {
  try {
    const { messages, patientContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await getMedicalResponse(messages, patientContext);
    res.json({ response, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response', 
      details: error.message 
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const studentData = req.body;

    // Call Python Flask API for prediction
    const response = await axios.post('http://localhost:5000/predict', studentData);

    res.json(response.data);
  } catch (error) {
    console.error('Error calling Python API:', error.message);
    res.status(500).json({ error: 'Prediction service unavailable' });
  }
});

module.exports = router;

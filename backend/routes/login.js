// routes/login.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  // login logic here
  res.json({ message: 'Login successful' });
});

module.exports = router;

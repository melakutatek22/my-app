const express = require('express');
const router = express.Router();
const { verifyToken } = require('../auth');

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.json({ userId: req.userId, message: "This is protected data!" });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { pool } = require('../db'); // Assume we export pool from db.js
const { generateToken } = require('../auth');

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (!user.rows[0] || user.rows[0].password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken(user.rows[0].id);
  res.json({ token });
});

// Register (example)
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
  res.json({ message: "User registered!" });
});

module.exports = router;
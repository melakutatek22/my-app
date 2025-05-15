const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const { Pool } = require('pg');
const { generateToken, verifyToken } = require('./auth');

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',  // Docker service name
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  
  if (result.rows.length === 0) {
    return res.status(401).send('User not found');
  }

  const user = result.rows[0];
  // In a real app, compare hashed passwords (using bcrypt)
  if (password !== user.password) {
    return res.status(401).send('Invalid password');
  }

  const token = generateToken(user.id);
  res.json({ token });
});

// Protected route example
app.get('/profile', verifyToken, (req, res) => {
  res.send(`User ID: ${req.userId}`);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes); // Protected routes

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
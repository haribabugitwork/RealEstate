// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const signToken = (user) => jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

const signRefreshToken = (user) => jwt.sign(
  { id: user._id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash, role });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  res.json({ token, refreshToken });
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    const newToken = signToken(user);
    const newRefresh = signRefreshToken(user);
    user.refreshToken = newRefresh;
    await user.save();
    res.json({ token: newToken, refreshToken: newRefresh });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;

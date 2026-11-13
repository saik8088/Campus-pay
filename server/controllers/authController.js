const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'campuspay_dev_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { name, email, password } = req.body;

  // Fallback if MongoDB is not connected
  if (mongoose.connection.readyState !== 1) {
    const token = signToken('local-owner-' + Date.now());
    return res.status(201).json({
      token,
      user: { id: 'local-owner-' + Date.now(), name, email, role: 'owner' },
      isLocal: true,
    });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('[AUTH] Register error:', err.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
  }
  const { email, password } = req.body;

  // Fallback when database is not connected
  if (mongoose.connection.readyState !== 1) {
    const token = signToken('local-owner-' + Date.now());
    return res.json({
      token,
      user: {
        id: 'local-owner-001',
        name: email.split('@')[0] || 'Stall Owner',
        email,
        role: 'owner',
      },
      isLocal: true,
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = signToken(user._id);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('[AUTH] Login error:', err.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

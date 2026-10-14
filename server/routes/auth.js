const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'student_tracker_secret_key_2024';
const googleClient = new OAuth2Client();

// POST /api/auth/google — accept a Google ID token, then issue the app's JWT.
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({ message: 'Google sign-in is not configured' });
    }
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: clientId });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || !profile.email_verified) {
      return res.status(401).json({ message: 'Google account email is not verified' });
    }

    let user = await User.findOne({ googleId: profile.sub });
    if (!user) {
      user = await User.findOne({ email: profile.email.toLowerCase() });
      if (user) {
        user.googleId = profile.sub;
        await user.save();
      } else {
        const baseName = (profile.name || profile.email.split('@')[0]).trim().slice(0, 50) || 'Tracker user';
        user = await User.create({
          name: baseName,
          email: profile.email,
          googleId: profile.sub
        });
      }
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'This Google account is already linked to another user' });
    }
    res.status(401).json({ message: 'Google sign-in could not be verified' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ name: name.trim().toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this name already exists' });
    }

    const user = new User({
      name: name.trim().toLowerCase(),
      password
    });
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    const user = await User.findOne({ name: name.trim().toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

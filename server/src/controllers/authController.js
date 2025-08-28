const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {JWT_SECRET} = require('../../constants');

function generateToken(userId, rememberMe = false) {
  const secret = JWT_SECRET;
  // If remember me is checked, extend token to 1 month, otherwise 7 days
  const expiresIn = rememberMe ? '30d' : '7d';
  return jwt.sign({ sub: userId }, secret, { expiresIn });
}

async function register(req, res, next) {
  try {
    const { firstName, email, password, termsAccepted, rememberMe } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'firstName, email and password are required' });
    }

    if (!termsAccepted) {
      return res.status(400).json({ message: 'You must accept the terms and conditions to register' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Get client IP and user agent for terms acceptance tracking
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    const user = await User.create({ 
      firstName, 
      email, 
      passwordHash,
      termsAccepted: {
        accepted: true,
        acceptedAt: new Date(),
        acceptedVersion: '1.0.0',
        ipAddress,
        userAgent
      },
      preferences: {
        rememberMe: rememberMe || false
      }
    });

    const token = generateToken(user._id.toString(), rememberMe);
    
    // Update login stats
    await user.updateLoginStats();

    return res.status(201).json({
      message: 'Registered successfully',
      user: { 
        id: user._id, 
        firstName: user.firstName, 
        email: user.email,
        termsAccepted: user.termsAccepted,
        preferences: user.preferences
      },
      token,
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update user preferences if remember me is provided
    if (rememberMe !== undefined) {
      user.preferences.rememberMe = rememberMe;
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.preferences.rememberMe);
    
    // Update login stats
    await user.updateLoginStats();

    return res.json({
      message: 'Logged in successfully',
      user: { 
        id: user._id, 
        firstName: user.firstName, 
        email: user.email,
        termsAccepted: user.termsAccepted,
        preferences: user.preferences
      },
      token,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };


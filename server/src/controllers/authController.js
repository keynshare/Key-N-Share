const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(userId) {
  const secret = process.env.JWT_SECRET || 'dev_secret';
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

async function register(req, res, next) {
  try {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'firstName, email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ firstName, email, passwordHash });

    const token = generateToken(user._id.toString());
    return res.status(201).json({
      message: 'Registered successfully',
      user: { id: user._id, firstName: user.firstName, email: user.email },
      token,
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
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

    const token = generateToken(user._id.toString());
    return res.json({
      message: 'Logged in successfully',
      user: { id: user._id, firstName: user.firstName, email: user.email },
      token,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login };



const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectToDatabase } = require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();

// Database
connectToDatabase();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '1mb' }));

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    // origin: clientOrigin,
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan('dev'));

// Routes
app.get('/', (_req, res) => {
  res.send('Server is running: Key-N-Share');
});

app.use('/api/auth', authRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found', path: req.originalUrl });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Avoid leaking internal errors to clients
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message });
});

module.exports = app;



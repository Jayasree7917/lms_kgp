// ─────────────────────────────────────────────────────────────────────────────
//  KGP LMS — Express Server Entry Point
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/db');
const { verifyCloudinaryConfig } = require('./config/cloudinary');

// ── Route Imports ─────────────────────────────────────────────────────────────
const authRoutes        = require('./routes/authRoutes');
const courseRoutes      = require('./routes/courseRoutes');
const lectureRoutes     = require('./routes/lectureRoutes');
const enrollmentRoutes  = require('./routes/enrollmentRoutes');
const assessmentRoutes  = require('./routes/assessmentRoutes');
const reviewRoutes      = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Verify Cloudinary credentials on startup
verifyCloudinaryConfig();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet()); // Set secure HTTP headers

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use(globalLimiter);

// ── General Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check Route ────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 KGP LMS API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth',          authRoutes);
app.use('/api/v1/courses',       courseRoutes);
app.use('/api/v1',               lectureRoutes);
app.use('/api/v1',               enrollmentRoutes);
app.use('/api/v1',               assessmentRoutes);
app.use('/api/v1',               reviewRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('🔴 Server Error:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join('. ') });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File size too large.' });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║       🎓  KGP LMS API Server           ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Port:  ${PORT}                            ║`);
  console.log(`║  Mode:  ${(process.env.NODE_ENV || 'development').padEnd(31)}║`);
  console.log(`║  URL:   http://localhost:${PORT}            ║`);
  console.log('╚════════════════════════════════════════╝');
  console.log('');
});

module.exports = app;

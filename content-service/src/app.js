const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// Import routes
const postRoutes = require('./routes/post.routes');
const categoryRoutes = require('./routes/category.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/v1/posts', postRoutes);
//app.use('/api/v1/categories', categoryRoutes);

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'UP',
    database: dbStatus,
    timestamp: new Date()
  });
});

// Handle 404
app.use((req, res, next) => {
  next(new AppError('Not Found', 404));
});

// Error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
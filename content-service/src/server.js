require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Enhanced connection function
const connectWithRetry = async () => {
  console.log('Attempting MongoDB connection...');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    return false;
  }
};

// Start function with retries
const startServer = async () => {
  let retries = 5;
  
  while (retries > 0) {
    if (await connectWithRetry()) {
      // Start server if connection successful
      app.listen(process.env.PORT, () => {
        console.log(`🚀 Server running on port ${process.env.PORT}`);
      });
      return;
    }
    
    retries--;
    console.log(`Retries left: ${retries}. Waiting 5 seconds...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.error('🔥 Failed to connect to MongoDB after multiple retries');
  process.exit(1);
};

startServer();
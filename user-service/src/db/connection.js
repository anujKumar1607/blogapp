const mongoose = require('mongoose');
//const logger = require('../utils/logger');

const connectDB = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000;
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Connecting to MongoDB (attempt ${retryCount + 1})...`);
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 30000,
        authSource: process.env.MONGO_URI.includes('user-service') 
          ? 'user-service' 
          : 'content-service'
      });
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (err) {
      retryCount++;
      console.log(`Connection failed: ${err.message}`);
      
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      } else {
        console.log('🔥 Failed to connect after maximum retries');
        throw err; // Rethrow to be caught by the service
      }
    }
  }
};

module.exports = connectDB;
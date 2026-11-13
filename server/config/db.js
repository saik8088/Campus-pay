const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[DB] MONGODB_URI not set — running without database. Set it in .env to enable full functionality.');
    return false;
  }
  try {
    await mongoose.connect(uri);
    console.log('[DB] MongoDB connected successfully.');
    return true;
  } catch (err) {
    console.error('[DB] Connection failed:', err.message);
    return false;
  }
};

module.exports = connectDB;

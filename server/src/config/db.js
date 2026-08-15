import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_resume_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB at ${process.env.MONGO_URI}. ${error.message}`);
    console.warn(`[MongoDB] Operating in mock/in-memory database fallback mode if database is offline.`);
  }
};

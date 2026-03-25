import mongoose from 'mongoose';
import { config } from './environment';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongodbUri, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnect error:', error);
    process.exit(1);
  }
};

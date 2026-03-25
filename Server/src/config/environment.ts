import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  
  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/project-manager',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  
  // App
  appName: 'Project Manager Backend',
};

export const isDevelopment = config.nodeEnv === 'development';
export const isProduction = config.nodeEnv === 'production';
export const isTest = config.nodeEnv === 'test';

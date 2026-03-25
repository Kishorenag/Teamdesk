// import jwt, { SignOptions } from 'jsonwebtoken';
// import { config } from '../config/environment';
// import { IJWTPayload } from '../types/index';

// export const generateToken = (userId: string, email: string): string => {
//   const options: SignOptions = {
//     expiresIn: config.jwtExpiry,
//   };
//   return jwt.sign(
//     {
//       userId,
//       email,
//     },
//     config.jwtSecret,
//     options
//   );
// };

// export const verifyToken = (token: string): IJWTPayload | null => {
//   try {
//     const decoded = jwt.verify(token, config.jwtSecret) as IJWTPayload;
//     return decoded;
//   } catch {
//     return null;
//   }
// };

// export const decodeToken = (token: string): IJWTPayload | null => {
//   try {
//     const decoded = jwt.decode(token) as IJWTPayload;
//     return decoded;
//   } catch {
//     return null;
//   }
// };

import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/environment';
import { IJWTPayload } from '../types/index';

export const generateToken = (userId: string, email: string): string => {
  // Fix: Explicitly cast the string to the type expected by the library
  const options: SignOptions = {
    expiresIn: config.jwtExpiry as SignOptions['expiresIn'], 
  };
  
  return jwt.sign(
    {
      userId,
      email,
    },
    config.jwtSecret,
    options
  );
};

export const verifyToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as IJWTPayload;
    return decoded;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): IJWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as IJWTPayload;
    return decoded;
  } catch {
    return null;
  }
};
import { Request, Response, NextFunction } from 'express';
import { config, isDevelopment } from '../config/environment';

export interface AppError extends Error {
  status?: number;
  message: string;
}

export const errorHandler = (
  error: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = (error as AppError).status || 500;
  const message = error.message || 'Internal server error';

  if (isDevelopment) {
    console.error('Error:', error);
  }

  res.status(status).json({
    error: {
      message,
      ...(isDevelopment && { stack: error.stack }),
    },
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.path}`,
    },
  });
};

import { Response } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../types/index';

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;

      const response = await authService.register({
        email,
        password,
        name,
      });

      res.status(201).json({
        data: response,
        message: 'User registered successfully',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const response = await authService.login({
        email,
        password,
      });

      res.status(200).json({
        data: response,
        message: 'Login successful',
      });
    } catch (error) {
      res.status(401).json({
        error: (error as Error).message,
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await authService.getCurrentUser(req.user.userId);

      res.status(200).json({
        data: user,
        message: 'Current user retrieved',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }
}

export const authController = new AuthController();

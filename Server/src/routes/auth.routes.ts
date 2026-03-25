import { Router } from 'express';
import { authController } from '../controllers/index';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @body { email, password, name }
 * @returns { token, user }
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @body { email, password }
 * @returns { token, user }
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user
 * @auth required
 * @returns { user }
 */
router.get('/me', authMiddleware, (req, res) => authController.getCurrentUser(req, res));

export const authRoutes = router;

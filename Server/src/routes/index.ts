import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { projectRoutes } from './project.routes';
import { taskRoutes } from './task.routes';

const router = Router();

/**
 * API Routes
 * /api/auth/* - Authentication endpoints
 * /api/projects/* - Project management endpoints
 * /api/projects/:projectId/tasks/* - Task management endpoints
 */

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/projects/:projectId/tasks', taskRoutes);

export const apiRoutes = router;

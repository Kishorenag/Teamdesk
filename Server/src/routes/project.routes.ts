import { Router } from 'express';
import { projectController } from '../controllers/index';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All project routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/projects
 * @desc Get all projects for authenticated user
 * @auth required
 * @returns { projects[] }
 */
router.get('/', (req, res) => projectController.getProjects(req, res));

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @auth required
 * @body { name, description }
 * @returns { project }
 */
router.post('/', (req, res) => projectController.createProject(req, res));

/**
 * @route GET /api/projects/:id/analytics
 * @desc Get project analytics and statistics
 * @auth required
 * @params { id }
 * @returns { analytics }
 */
router.get('/:id/analytics', (req, res) => projectController.getProjectAnalytics(req, res));

/**
 * @route GET /api/projects/:id
 * @desc Get a specific project by ID
 * @auth required
 * @params { id }
 * @returns { project }
 */
router.get('/:id', (req, res) => projectController.getProjectById(req, res));

/**
 * @route PUT /api/projects/:id
 * @desc Update a project (owner only)
 * @auth required
 * @params { id }
 * @body { name, description, status }
 * @returns { project }
 */
router.put('/:id', (req, res) => projectController.updateProject(req, res));

/**
 * @route DELETE /api/projects/:id
 * @desc Delete a project (owner only)
 * @auth required
 * @params { id }
 * @returns { message }
 */
router.delete('/:id', (req, res) => projectController.deleteProject(req, res));

export const projectRoutes = router;

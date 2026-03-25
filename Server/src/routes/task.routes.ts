import { Router } from 'express';
import { taskController } from '../controllers/index';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

// All task routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/projects/:projectId/tasks
 * @desc Get all tasks for a project
 * @auth required
 * @params { projectId }
 * @returns { tasks[] }
 */
router.get('/', (req, res) => taskController.getProjectTasks(req, res));

/**
 * @route POST /api/projects/:projectId/tasks
 * @desc Create a new task
 * @auth required
 * @params { projectId }
 * @body { title, description, priority, columnId, assignedTo, dueDate }
 * @returns { task }
 */
router.post('/', (req, res) => taskController.createTask(req, res));

/**
 * @route GET /api/projects/:projectId/tasks/:taskId
 * @desc Get a specific task
 * @auth required
 * @params { projectId, taskId }
 * @returns { task }
 */
router.get('/:taskId', (req, res) => taskController.getTaskById(req, res));

/**
 * @route PUT /api/projects/:projectId/tasks/:taskId
 * @desc Update a task
 * @auth required
 * @params { projectId, taskId }
 * @body { title, description, status, priority, assignedTo, dueDate, subtasks }
 * @returns { task }
 */
router.put('/:taskId', (req, res) => taskController.updateTask(req, res));

/**
 * @route DELETE /api/projects/:projectId/tasks/:taskId
 * @desc Delete a task
 * @auth required
 * @params { projectId, taskId }
 * @returns { message }
 */
router.delete('/:taskId', (req, res) => taskController.deleteTask(req, res));

/**
 * @route PATCH /api/projects/:projectId/tasks/:taskId/move
 * @desc Move a task to a different column
 * @auth required
 * @params { projectId, taskId }
 * @body { columnId, position }
 * @returns { task }
 */
router.patch('/:taskId/move', (req, res) => taskController.moveTask(req, res));

export const taskRoutes = router;

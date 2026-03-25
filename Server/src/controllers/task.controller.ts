import { Response } from 'express';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../types/index';

export class TaskController {
  async getProjectTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const tasks = await taskService.getProjectTasks(projectId);

      res.status(200).json({
        data: tasks,
        message: 'Tasks retrieved',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const task = await taskService.getTaskById(taskId);

      res.status(200).json({
        data: task,
        message: 'Task retrieved',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const taskData = {
        ...req.body,
        projectId,
      };

      const task = await taskService.createTask(taskData);

      res.status(201).json({
        data: task,
        message: 'Task created',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const task = await taskService.updateTask(taskId, req.body);

      res.status(200).json({
        data: task,
        message: 'Task updated',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      await taskService.deleteTask(taskId);

      res.status(200).json({
        message: 'Task deleted',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async moveTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { columnId, position } = req.body;

      const task = await taskService.moveTask(taskId, columnId, position);

      res.status(200).json({
        data: task,
        message: 'Task moved',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async getProjectAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const analytics = await taskService.getProjectAnalytics(projectId);

      res.status(200).json({
        data: analytics,
        message: 'Analytics retrieved',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }
}

export const taskController = new TaskController();

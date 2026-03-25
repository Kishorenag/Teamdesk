import { Response } from 'express';
import { projectService } from '../services/project.service';
import { taskService } from '../services/task.service';
import { AuthRequest } from '../types/index';

export class ProjectController {
  async getProjects(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const projects = await projectService.getProjects(req.user.userId);

      res.status(200).json({
        data: projects,
        message: 'Projects retrieved',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async getProjectById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const project = await projectService.getProjectById(id, req.user.userId);

      res.status(200).json({
        data: project,
        message: 'Project retrieved',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async createProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { name, description } = req.body;
      const project = await projectService.createProject(
        { name, description },
        req.user.userId
      );

      res.status(201).json({
        data: project,
        message: 'Project created',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async updateProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const project = await projectService.updateProject(
        id,
        req.body,
        req.user.userId
      );

      res.status(200).json({
        data: project,
        message: 'Project updated',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async deleteProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      await projectService.deleteProject(id, req.user.userId);

      res.status(200).json({
        message: 'Project deleted',
      });
    } catch (error) {
      res.status(400).json({
        error: (error as Error).message,
      });
    }
  }

  async getProjectAnalytics(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      // Verify user has access to this project
      await projectService.getProjectById(id, req.user.userId);

      // Get analytics data
      const analytics = await taskService.getProjectAnalytics(id);

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

export const projectController = new ProjectController();

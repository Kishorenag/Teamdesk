import { Task, Column, Project } from '../models/index';
import { ICreateTaskInput, IUpdateTaskInput, IAnalytics } from '../types/index';

export class TaskService {
  async getProjectTasks(projectId: string) {
    return Task.find({ projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('columnId', 'name position')
      .sort({ createdAt: -1 });
  }

  async getTaskById(taskId: string) {
    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email avatar')
      .populate('columnId', 'name position');

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async createTask(data: ICreateTaskInput) {
    const task = await Task.create(data);

    // Add task to column
    await Column.findByIdAndUpdate(
      data.columnId,
      { $push: { tasks: task._id } }
    );

    return task.populate('assignedTo', 'name email avatar');
  }

  async updateTask(taskId: string, data: IUpdateTaskInput) {
    const task = await Task.findByIdAndUpdate(taskId, data, {
      new: true,
    })
      .populate('assignedTo', 'name email avatar')
      .populate('columnId', 'name position');

    if (!task) {
      throw new Error('Task not found');
    }

    return task;
  }

  async deleteTask(taskId: string) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Remove task from column
    await Column.findByIdAndUpdate(
      task.columnId,
      { $pull: { tasks: taskId } }
    );

    await Task.findByIdAndDelete(taskId);
  }

  async moveTask(
    taskId: string,
    columnId: string,
    position: number
  ) {
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    // Remove from old column
    if (task.columnId.toString() !== columnId) {
      await Column.findByIdAndUpdate(
        task.columnId,
        { $pull: { tasks: taskId } }
      );

      // Add to new column
      await Column.findByIdAndUpdate(
        columnId,
        { $push: { tasks: taskId } }
      );

      task.columnId = columnId;
    }

    await task.save();
    return task;
  }

  async getProjectAnalytics(projectId: string): Promise<IAnalytics> {
    const tasks = await Task.find({ projectId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'done').length;
    const pendingTasks = totalTasks - completedTasks;

    const tasksByStatus = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      review: tasks.filter((t) => t.status === 'review').length,
      done: tasks.filter((t) => t.status === 'done').length,
    };

    const tasksByPriority = {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
      urgent: tasks.filter((t) => t.priority === 'urgent').length,
    };

    const project = await Project.findById(projectId);
    const teamMembers = project?.members.length || 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      tasksByStatus,
      tasksByPriority,
      teamMembers,
    };
  }
}

export const taskService = new TaskService();

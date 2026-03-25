import { Request } from 'express';
import { Types } from 'mongoose';

// User types
export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUserInput {
  email: string;
  password: string;
  name: string;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: Omit<IUser, 'password'>;
}

// Project types
export interface IProject {
  _id?: string;
  name: string;
  description: string;
  owner: Types.ObjectId | string; 
  members: (Types.ObjectId | string)[];
  columns: (Types.ObjectId | string)[];
  status: 'active' | 'archived' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateProjectInput {
  name: string;
  description: string;
}

// Column types
export interface IColumn {
  _id?: string;
  name: string;
  position: number;
  projectId: Types.ObjectId | string; // 👈 Allow ObjectId
  tasks: (Types.ObjectId | string)[]; // 👈 Allow ObjectId array
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateColumnInput {
  name: string;
  position: number;
}

// Task types
export interface ITask {
  _id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  columnId: Types.ObjectId | string; // 👈 Allow ObjectId
  projectId: Types.ObjectId | string; // 👈 Allow ObjectId
  assignedTo?: Types.ObjectId | string; // 👈 Allow ObjectId
  dueDate?: Date;
  subtasks: ISubtask[];
  attachments: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubtask {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface ICreateTaskInput {
  title: string;
  description: string;
  status: string;
  priority: string;
  columnId: string;
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface IUpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  dueDate?: string;
}

// Analytics types
export interface IAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  tasksByStatus: {
    todo: number;
    'in-progress': number;
    review: number;
    done: number;
  };
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  teamMembers: number;
}

// JWT Payload types
export interface IJWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Express Request extension
export interface AuthRequest extends Request {
  user?: IJWTPayload;
}

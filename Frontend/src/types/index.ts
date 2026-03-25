// User types
export interface User {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member' | 'user';
  createdAt?: Date;
}

// Task types
export interface Task {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  columnId?: string;
  column?: string;
  projectId?: string;
  project?: string;
  assignedTo?: User | string;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  subtasks?: Subtask[];
  attachments?: Attachment[];
}

// Subtask types
export interface Subtask {
  _id?: string;
  id?: string;
  taskId?: string;
  title: string;
  completed: boolean;
  createdAt?: Date;
}

// Column types (for Kanban board)
export interface Column {
  _id?: string;
  id?: string;
  name: string;
  projectId?: string;
  project?: string;
  position?: number;
  tasks?: Task[];
}

// Project types
export interface Project {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  status?: 'active' | 'archived' | 'on-hold';
  columns?: Column[];
  members?: User[];
  owner?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

// Attachment types
export interface Attachment {
  _id?: string;
  id?: string;
  taskId?: string;
  fileName?: string;
  name?: string;
  url?: string;
  fileUrl?: string;
  fileSize?: number;
  uploadedAt?: Date;
}

// Form types
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  assignedTo?: string;
  columnId?: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id?: string;
  _id?: string;
  status?: 'todo' | 'in-progress' | 'review' | 'done';
}

export interface CreateProjectInput {
  name: string;
  description: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

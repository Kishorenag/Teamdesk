import axios, { AxiosInstance } from 'axios';
import { User, Project, Task, CreateProjectInput, CreateTaskInput, UpdateTaskInput, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if it exists
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/auth/register', { email, password, name });
    return response.data;
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.client.post('/auth/logout');
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // Project endpoints
  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response = await this.client.get('/projects');
    return response.data;
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    const response = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: CreateProjectInput): Promise<ApiResponse<Project>> {
    const response = await this.client.post('/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: Partial<CreateProjectInput>): Promise<ApiResponse<Project>> {
    const response = await this.client.put(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string): Promise<ApiResponse<null>> {
    const response = await this.client.delete(`/projects/${id}`);
    return response.data;
  }

  // Task endpoints
  async getTasks(projectId: string): Promise<ApiResponse<Task[]>> {
    const response = await this.client.get(`/projects/${projectId}/tasks`);
    return response.data;
  }

  async getTask(projectId: string, taskId: string): Promise<ApiResponse<Task>> {
    const response = await this.client.get(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  }

  async createTask(projectId: string, data: CreateTaskInput): Promise<ApiResponse<Task>> {
    const response = await this.client.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  }

  async updateTask(projectId: string, taskId: string, data: UpdateTaskInput): Promise<ApiResponse<Task>> {
    const response = await this.client.put(`/projects/${projectId}/tasks/${taskId}`, data);
    return response.data;
  }

  async deleteTask(projectId: string, taskId: string): Promise<ApiResponse<null>> {
    const response = await this.client.delete(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  }

  async moveTask(projectId: string, taskId: string, columnId: string, position: number): Promise<ApiResponse<Task>> {
    const response = await this.client.patch(`/projects/${projectId}/tasks/${taskId}/move`, {
      columnId,
      position,
    });
    return response.data;
  }

  // Analytics endpoints
  async getProjectAnalytics(projectId: string) {
    const response = await this.client.get(`/projects/${projectId}/analytics`);
    return response.data;
  }
}

export const apiService = new ApiService();

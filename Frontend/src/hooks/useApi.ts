import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import { CreateProjectInput, CreateTaskInput, UpdateTaskInput } from '@/types';

// User hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiService.getCurrentUser();
      return response.data;
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { email: string; password: string }) =>
      apiService.login(variables.email, variables.password),
    onSuccess: (data) => {
      if (data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
        queryClient.setQueryData(['currentUser'], data.data?.user);
      }
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { email: string; password: string; name: string }) =>
      apiService.register(variables.email, variables.password, variables.name),
    onSuccess: (data) => {
      if (data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
        queryClient.setQueryData(['currentUser'], data.data?.user);
      }
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.removeQueries({ queryKey: ['projects'] });
    },
  });
}

// Project hooks
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiService.getProjects();
      return response.data || [];
    },
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ['projects', projectId],
    queryFn: async () => {
      const response = await apiService.getProject(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectInput) => apiService.createProject(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if (data.data?.id) {
        queryClient.setQueryData(['projects', data.data.id], data.data);
      }
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; data: Partial<CreateProjectInput> }) =>
      apiService.updateProject(variables.id, variables.data),
    onSuccess: (data) => {
      if (data.data?.id) {
        queryClient.setQueryData(['projects', data.data.id], data.data);
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId: string) => apiService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

// Task hooks
export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await apiService.getTasks(projectId);
      return response.data || [];
    },
    enabled: !!projectId,
  });
}

export function useTask(projectId: string, taskId: string) {
  return useQuery({
    queryKey: ['tasks', projectId, taskId],
    queryFn: async () => {
      const response = await apiService.getTask(projectId, taskId);
      return response.data;
    },
    enabled: !!projectId && !!taskId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { projectId: string; title: string; description?: string; priority?: string; columnId: string }) =>
      apiService.createTask(variables.projectId, {
        title: variables.title,
        description: variables.description,
        priority: variables.priority,
        columnId: variables.columnId,
      } as CreateTaskInput),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { projectId: string; taskId: string; data: UpdateTaskInput }) =>
      apiService.updateTask(variables.projectId, variables.taskId, variables.data),
    onSuccess: (data, variables) => {
      if (data.data?.id) {
        queryClient.setQueryData(['tasks', variables.projectId, data.data.id], data.data);
      }
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { projectId: string; taskId: string }) =>
      apiService.deleteTask(variables.projectId, variables.taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });
}

export function useMoveTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { projectId: string; taskId: string; columnId: string; position: number }) =>
      apiService.moveTask(variables.projectId, variables.taskId, variables.columnId, variables.position),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.projectId] });
    },
  });
}

// Analytics hooks
export function useProjectAnalytics(projectId: string) {
  return useQuery({
    queryKey: ['analytics', projectId],
    queryFn: async () => {
      const response = await apiService.getProjectAnalytics(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });
}

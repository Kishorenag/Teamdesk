import { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Chip,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import '../styles/TasksPage.css';

const statusConfig: any = {
  todo: { color: '#9ca3af', bgColor: '#f3f4f6', label: 'To Do', icon: '📋' },
  'in-progress': { color: '#f59e0b', bgColor: '#fef3c7', label: 'In Progress', icon: '⚙️' },
  review: { color: '#3b82f6', bgColor: '#dbeafe', label: 'Review', icon: '👀' },
  done: { color: '#10b981', bgColor: '#d1fae5', label: 'Done', icon: '✓' },
};

const priorityConfig: any = {
  low: { color: '#10b981', label: 'Low', bgColor: '#d1fae5' },
  medium: { color: '#f59e0b', label: 'Medium', bgColor: '#fef3c7' },
  high: { color: '#ef4444', label: 'High', bgColor: '#fee2e2' },
  urgent: { color: '#dc2626', label: 'Urgent', bgColor: '#fecaca' },
};

export function TasksPage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiService.getProjects();
      return response.data || [];
    },
  });

  // Fetch tasks for selected project
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', selectedProject],
    queryFn: async () => {
      if (!selectedProject) return [];
      const response = await apiService.getTasks(selectedProject);
      return response.data || [];
    },
    enabled: !!selectedProject,
  });

  // Delete task mutation
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      await apiService.deleteTask(selectedProject, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', selectedProject] });
    },
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Tasks
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6b7280',
              fontSize: '0.95rem',
            }}
          >
            Manage and track all your tasks across projects
          </Typography>
        </Box>

        {/* Project Filter */}
        {projects.length > 0 && (
          <FormControl 
            sx={{ 
              minWidth: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: '#f8f9ff',
                '&:hover fieldset': {
                  borderColor: '#667eea',
                },
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e5e7eb',
              },
            }}
          >
            <InputLabel sx={{ color: '#6b7280' }}>Select Project</InputLabel>
            <Select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              label="Select Project"
            >
              {projects.map((project: any) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '12px', 
            mb: 3,
            backgroundColor: '#fee',
          }}
        >
          Failed to load tasks. Please try again.
        </Alert>
      )}

      {!selectedProject ? (
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            border: '2px dashed #e5e7eb',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#6b7280',
              mb: 1,
            }}
          >
            Select a project to view tasks
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9ca3af',
            }}
          >
            Choose a project from the dropdown above to see all associated tasks
          </Typography>
        </Card>
      ) : isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: '#667eea' }} />
        </Box>
      ) : tasks.length > 0 ? (
        <Card
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9ff', borderBottom: '2px solid #e5e7eb' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937', width: '35%' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937' }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937' }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937', textAlign: 'center' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1f2937', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task: any) => (
                  <TableRow
                    key={task.id}
                    sx={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#f9fafb',
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: statusConfig[task.status]?.color || '#9ca3af',
                          }}
                        />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#1f2937',
                          }}
                        >
                          {task.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={statusConfig[task.status]?.label || task.status}
                        size="small"
                        sx={{
                          backgroundColor: statusConfig[task.status]?.bgColor || '#f3f4f6',
                          color: statusConfig[task.status]?.color || '#6b7280',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={priorityConfig[task.priority]?.label || task.priority}
                        size="small"
                        sx={{
                          backgroundColor: priorityConfig[task.priority]?.bgColor || '#f3f4f6',
                          color: priorityConfig[task.priority]?.color || '#6b7280',
                          fontWeight: 600,
                          borderRadius: '6px',
                          border: 'none',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6b7280',
                        }}
                      >
                        {task.assignedTo || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: '0.85rem',
                        }}
                      >
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Tooltip title="Delete task">
                        <IconButton
                          size="small"
                          onClick={() => deleteTask.mutate(task.id)}
                          disabled={deleteTask.isPending}
                          sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: '#fee2e2' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ) : (
        <Card
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
            border: '2px dashed #e5e7eb',
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#6b7280',
              mb: 1,
            }}
          >
            No tasks yet
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9ca3af',
            }}
          >
            Create your first task to get started
          </Typography>
        </Card>
      )}
    </Box>
  );
}

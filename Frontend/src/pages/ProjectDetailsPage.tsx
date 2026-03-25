import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  AvatarGroup,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import { 
  Add as AddIcon, 
  ArrowBack as ArrowBackIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import { useProject, useCreateTask } from '@/hooks';
import '../styles/ProjectDetailsPage.css';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  columnId: z.string().min(1, 'Column is required'),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

const PRIORITY_CONFIG: Record<string, { color: string; backgroundColor: string; icon: string }> = {
  low: { color: '#10b981', backgroundColor: '#d1fae5', icon: '↓' },
  medium: { color: '#f59e0b', backgroundColor: '#fef3c7', icon: '→' },
  high: { color: '#ef4444', backgroundColor: '#fee2e2', icon: '↑' },
  urgent: { color: '#dc2626', backgroundColor: '#fecaca', icon: '!!' },
};

const STATUS_CONFIG: Record<string, { color: string; backgroundColor: string }> = {
  'todo': { color: '#9ca3af', backgroundColor: '#f3f4f6' },
  'in-progress': { color: '#f59e0b', backgroundColor: '#ffe5b4' },
  'review': { color: '#3b82f6', backgroundColor: '#dbeafe' },
  'done': { color: '#10b981', backgroundColor: '#d1fae5' },
};

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const { data: project, isLoading, error } = useProject(id || '');
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: 'medium',
      columnId: '',
    },
  });

  const onSubmit = (data: CreateTaskFormData) => {
    if (!id) return;
    createTask({
      projectId: id,
      title: data.title,
      description: data.description,
      priority: data.priority,
      columnId: data.columnId,
    },
    {
      onSuccess: () => {
        reset();
        setOpenDialog(false);
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mb: 3, color: '#667eea', fontWeight: 600 }}
        >
          Back to Projects
        </Button>
        <Alert severity="error" sx={{ borderRadius: '12px' }}>
          Failed to load project. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mb: 2, color: '#667eea', fontWeight: 600 }}
        >
          Back to Projects
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {project.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#6b7280',
                fontSize: '0.95rem',
                maxWidth: '600px',
              }}
            >
              {project.description}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add Task
          </Button>
        </Box>
      </Box>

      {/* Project Info Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Owner Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Owner
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  {project.owner?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {project.owner?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                    {project.owner?.email}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Members Card */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Team ({project.members?.length || 0})
              </Typography>
              <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                {project.members?.map((member) => (
                  <Tooltip key={member._id || member.id} title={member.name}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        background: 'linear-gradient(135deg, #f093fb 0%, #4facfe 100%)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {member.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </AvatarGroup>
            </CardContent>
          </Card>
        </Grid>

        {/* Tasks Count */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: '#667eea',
              },
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Total Tasks
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#667eea',
                  fontSize: '1.75rem',
                }}
              >
                {project.columns?.reduce((sum, col) => sum + (col.tasks?.length || 0), 0) || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Status */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Status
              </Typography>
              <Chip
                label={project.status || 'Active'}
                sx={{
                  backgroundColor: project.status === 'active' ? '#d1fae5' : '#f3f4f6',
                  color: project.status === 'active' ? '#10b981' : '#6b7280',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Columns with Tasks */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: '#1f2937',
            mb: 2,
          }}
        >
          Tasks by Status
        </Typography>

        <Grid container spacing={2}>
          {project.columns?.map((column) => (
            <Grid item xs={12} sm={6} md={3} key={column._id || column.id}>
              <Card
                sx={{
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                  border: '2px solid #e5e7eb',
                  minHeight: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  {/* Column Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box
                      sx={{
                        width: '3px',
                        height: '20px',
                        borderRadius: '2px',
                        background: STATUS_CONFIG[column.name.toLowerCase()]?.color || '#9ca3af',
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: '#1f2937',
                        flex: 1,
                      }}
                    >
                      {column.name}
                    </Typography>
                    <Chip
                      label={column.tasks?.length || 0}
                      size="small"
                      sx={{
                        backgroundColor: '#e5e7eb',
                        color: '#6b7280',
                        fontWeight: 600,
                        height: '24px',
                      }}
                    />
                  </Box>

                  {/* Tasks */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {column.tasks && column.tasks.length > 0 ? (
                      column.tasks.map((task: any) => (
                        <Card
                          key={task._id}
                          sx={{
                            borderRadius: '8px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                              <DragIcon sx={{ fontSize: '16px', color: '#d1d5db' }} />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: '#1f2937',
                                  flex: 1,
                                }}
                              >
                                {task.title}
                              </Typography>
                            </Box>

                            {task.description && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#9ca3af',
                                  display: 'block',
                                  mb: 1,
                                  fontSize: '0.75rem',
                                  lineHeight: 1.4,
                                }}
                              >
                                {task.description?.substring(0, 60)}...
                              </Typography>
                            )}

                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {task.priority && (
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  sx={{
                                    height: '20px',
                                    fontSize: '0.7rem',
                                    backgroundColor: PRIORITY_CONFIG[task.priority]?.backgroundColor,
                                    color: PRIORITY_CONFIG[task.priority]?.color,
                                    fontWeight: 600,
                                    borderRadius: '4px',
                                    border: 'none',
                                  }}
                                />
                              )}
                              {task.assignedTo && (
                                <Tooltip title={task.assignedTo.name}>
                                  <Avatar
                                    sx={{
                                      width: '20px',
                                      height: '20px',
                                      fontSize: '0.65rem',
                                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    }}
                                  >
                                    {task.assignedTo.name?.charAt(0).toUpperCase()}
                                  </Avatar>
                                </Tooltip>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 3,
                          color: '#9ca3af',
                        }}
                      >
                        <Typography variant="body2">No tasks yet</Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Add Task Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.25rem',
          }}
        >
          Create New Task
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Task Title"
            placeholder="Enter task title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            placeholder="Enter task description"
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              {...register('priority')}
              label="Priority"
              sx={{
                borderRadius: '8px',
              }}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Column</InputLabel>
            <Select
              {...register('columnId')}
              label="Column"
              sx={{
                borderRadius: '8px',
              }}
            >
              {project.columns?.map((col) => (
                <MenuItem key={col._id || col.id} value={col._id || col.id || ''}>
                  {col.name}
                </MenuItem>
              ))}
            </Select>
            {errors.columnId && (
              <Typography variant="caption" sx={{ color: '#ef4444', mt: 0.5 }}>
                {errors.columnId.message}
              </Typography>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: '#6b7280',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={isCreatingTask}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {isCreatingTask ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

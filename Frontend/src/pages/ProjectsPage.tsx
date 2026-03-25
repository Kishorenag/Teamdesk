import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, FolderOpen as FolderIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '@/services/api.service';
import '../styles/ProjectsPage.css';

// Validation schema
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').min(3, 'Name must be at least 3 characters'),
  description: z.string().default(''),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const PROJECT_COLORS = [
  { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '📊' },
  { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🎯' },
  { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '🚀' },
  { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '💚' },
  { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '⭐' },
  { bg: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', icon: '🔥' },
];

export function ProjectsPage() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  // Fetch all projects
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiService.getProjects();
      return response.data || [];
    },
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const response = await apiService.createProject(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      reset();
      setOpenDialog(false);
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiService.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleOpenDialog = () => {
    reset();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
  };

  const onSubmit = (data: ProjectFormData) => {
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box className="projects-header">
        <Box className="projects-header__title-container">
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              className="projects-header__title"
            >
              Projects
            </Typography>
            <Typography 
              variant="body1" 
              className="projects-header__subtitle"
            >
              Create and manage your projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            className="projects-header__create-button"
          >
            New Project
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          className="projects-error"
        >
          Failed to load projects
        </Alert>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <Grid container spacing={3}>
          {projects.map((project, idx) => {
            const colorScheme = PROJECT_COLORS[idx % PROJECT_COLORS.length];
            const projectId = project._id || project.id;
            return (
              <Grid item xs={12} sm={6} md={4} key={projectId}>
                <Card className="project-card" style={{ '--header-bg': colorScheme.bg } as React.CSSProperties}>
                  {/* Color Header */}
                  <Box
                    className="project-card__header"
                    style={{ background: colorScheme.bg }}
                  >
                    <Box className="project-card__header-icon">
                      {colorScheme.icon}
                    </Box>
                    <IconButton 
                      size="small"
                      className="project-card__header-menu"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Content */}
                  <CardContent className="project-card__content">
                    <Typography 
                      variant="h6" 
                      className="project-card__title"
                    >
                      {project.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="project-card__description"
                    >
                      {project.description || 'No description provided'}
                    </Typography>
                    <Box className="project-card__stats">
                      <Chip
                        label={`${project.columns?.length || 0} columns`}
                        size="small"
                        className="project-card__stat-chip project-card__stat-columns"
                      />
                      <Chip
                        label={`${project.columns?.reduce((sum: number, c: any) => sum + (c.tasks?.length || 0), 0) || 0} tasks`}
                        size="small"
                        className="project-card__stat-chip project-card__stat-tasks"
                      />
                    </Box>
                    <Typography 
                      variant="caption" 
                      className="project-card__status"
                    >
                      {project.status || 'active'}
                    </Typography>
                  </CardContent>

                  {/* Actions */}
                  <CardActions className="project-card__actions">
                    <Button
                      size="small"
                      fullWidth
                      onClick={() => navigate(`/projects/${projectId}`)}
                      className="project-card__detail-button"
                    >
                      View Details
                    </Button>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const id = project.id || project._id;
                        if (id) deleteMutation.mutate(id);
                      }}
                      disabled={deleteMutation.isPending}
                      className="project-card__delete-button"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Card className="projects-empty-state">
          <FolderIcon className="projects-empty-state__icon" />
          <Typography 
            variant="h6" 
            className="projects-empty-state__title"
          >
            No projects yet
          </Typography>
          <Typography 
            variant="body2" 
            className="projects-empty-state__description"
          >
            Create your first project to start managing tasks and collaborating with your team
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            className="projects-empty-state__button"
          >
            Create Your First Project
          </Button>
        </Card>
      )}

      {/* Create Project Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <DialogTitle className="project-dialog__title">
          Create New Project
        </DialogTitle>
        <DialogContent className="project-dialog__content">
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            className="project-dialog__input"
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            className="project-dialog__input"
          />
        </DialogContent>
        <DialogActions className="project-dialog__footer">
          <Button 
            onClick={handleCloseDialog}
            className="project-dialog__cancel-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={createMutation.isPending}
            className="project-dialog__submit-button"
          >
            {createMutation.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import { useProjects } from '@/hooks';
import { ProjectCard } from '@/components';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import '../styles/DashboardPage.css';

export function DashboardPage() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <Box className="dashboard-loading">
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="dashboard-error">
        Failed to load projects. Please try again.
      </Alert>
    );
  }

  const totalProjects = projects?.length || 0;
  const activeTasks = projects?.reduce((sum, p) => sum + ((p.columns || []).reduce((s: number, c: any) => s + ((c.tasks || []).length), 0)), 0) || 0;
  const completedTasks = projects?.reduce((sum, p) => sum + (p.columns?.find(c => c.name === 'Done')?.tasks?.length || 0), 0) || 0;

  return (
    <Box>
      {/* Header Section */}
      <Box className="dashboard-header">
        <Box className="dashboard-header__title-container">
          <Box>
            <Typography 
              variant="h3" 
              component="h1" 
              className="dashboard-header__title"
            >
              Dashboard
            </Typography>
            <Typography 
              variant="body1" 
              className="dashboard-header__subtitle"
            >
              Welcome back! Here's your project overview
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="dashboard-header__create-button"
          >
            New Project
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} className="dashboard-stats">
        {[
          { label: 'Total Projects', value: totalProjects, color: '#667eea', icon: '📁' },
          { label: 'Active Tasks', value: activeTasks, color: '#764ba2', icon: '⚡' },
          { label: 'Completed', value: completedTasks, color: '#10b981', icon: '✓' },
          { label: 'In Progress', value: activeTasks - completedTasks, color: '#f59e0b', icon: '⏱' },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card className="dashboard-stat-card" style={{ '--stat-color': stat.color } as React.CSSProperties}>
              <Box className="dashboard-stat-card__content">
                <Box>
                  <Typography 
                    variant="body2" 
                    className="dashboard-stat-card__label"
                  >
                    {stat.label}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    className="dashboard-stat-card__value"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Typography className="dashboard-stat-card__icon">{stat.icon}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Projects Section */}
      {projects && projects.length > 0 ? (
        <Box className="dashboard-projects">
          <Box className="dashboard-projects__header">
            <Typography 
              variant="h5" 
              className="dashboard-projects__title"
            >
              <Box className="dashboard-projects__title-indicator" />
              Recent Projects
            </Typography>
          </Box>
          <Grid 
            container 
            spacing={3}
            className="dashboard-projects__grid"
          >
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Card className="dashboard-empty-state">
          <Typography 
            variant="h6" 
            className="dashboard-empty-state__title"
          >
            No projects yet
          </Typography>
          <Typography 
            variant="body2" 
            className="dashboard-empty-state__description"
          >
            Create your first project to get started with tracking tasks and managing your team
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="dashboard-empty-state__button"
          >
            Create Project
          </Button>
        </Card>
      )}
    </Box>
  );
}

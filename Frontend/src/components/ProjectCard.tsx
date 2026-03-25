import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const taskCount = project.columns.reduce((sum, col) => sum + col.tasks.length, 0);

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'archived':
        return 'error';
      case 'on-hold':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card
      component={Link}
      to={`/projects/${project.id}`}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: (theme: any) => theme.shadows[8],
          transform: 'translateY(-4px)',
          borderColor: '#667eea',
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, flex: 1 }}>
            {project.name}
          </Typography>
          <Chip
            label={project.status}
            size="small"
            color={getStatusColor(project.status)}
            variant="outlined"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {project.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="caption" color="textSecondary">
            {taskCount} Tasks
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {project.members.length} Members
          </Typography>
        </Box>
        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
          {project.members.map((member) => (
            <Avatar key={member.id} src={member.avatar} alt={member.name} title={member.name}>
              {member.name[0]}
            </Avatar>
          ))}
        </AvatarGroup>
      </CardActions>
    </Card>
  );
}

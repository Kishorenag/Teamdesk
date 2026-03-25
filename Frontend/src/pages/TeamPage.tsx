import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Container,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Email as EmailIcon, Shield as ShieldIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';
import '../styles/TeamPage.css';

export function TeamPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [email, setEmail] = useState('');

  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await apiService.getCurrentUser();
      return response.data;
    },
  });

  // Fetch projects to see team members
  const { data: projects = [], isLoading: projectsLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiService.getProjects();
      return response.data || [];
    },
  });

  // Extract unique team members from all projects
  const teamMembers = Array.from(
    new Map(
      projects
        .flatMap((p: any) => p.members || [])
        .map((member: any) => [member._id, member])
    ).values()
  );

  const handleAddMember = () => {
    // This would be implemented to add a user to a project
    console.log('Adding member:', email);
    setEmail('');
    setOpenDialog(false);
  };

  if (userLoading || projectsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
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
              Team
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6b7280',
                fontSize: '0.95rem',
              }}
            >
              Manage team members and collaboration
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            disabled
            title="Feature coming soon"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              padding: '10px 24px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add Member
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: '12px', 
            mb: 3,
            backgroundColor: '#fee',
          }}
        >
          Failed to load team members. Please try again.
        </Alert>
      )}

      {/* Current User Card */}
      {currentUser && (
        <Card
          sx={{
            mb: 5,
            borderRadius: '12px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'translate(50%, -50%)',
            }}
          />
          <CardContent sx={{ position: 'relative', zIndex: 1, p: 3, color: 'white' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={currentUser?.avatar}
                sx={{
                  width: 80,
                  height: 80,
                  border: '3px solid white',
                  fontSize: '2rem',
                }}
              >
                {currentUser?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'white',
                    }}
                  >
                    {currentUser?.name}
                  </Typography>
                  <Chip
                    label="You"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 600,
                      border: 'none',
                    }}
                  />
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <EmailIcon fontSize="small" />
                  {currentUser?.email}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Team Members Section */}
      {teamMembers.length > 0 ? (
        <Card
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid #f3f4f6' }}>
              <Box sx={{ width: '4px', height: '24px', borderRadius: '2px', background: '#667eea' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                Team Members ({teamMembers.length})
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9ff', borderBottom: '2px solid #e5e7eb' }}>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1f2937', textAlign: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member: any) => (
                    <TableRow
                      key={member._id}
                      sx={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={member.avatar}
                            sx={{ width: 40, height: 40 }}
                          >
                            {member.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1f2937' }}>
                            {member.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          {member.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<ShieldIcon fontSize="small" />}
                          label={member.role?.toUpperCase() || 'MEMBER'}
                          size="small"
                          sx={{
                            backgroundColor: '#f0f4ff',
                            color: '#667eea',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.status || 'Active'}
                          size="small"
                          sx={{
                            backgroundColor: '#d1fae5',
                            color: '#10b981',
                            fontWeight: 600,
                            borderRadius: '6px',
                            border: 'none',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Tooltip title="Remove member (coming soon)">
                          <IconButton
                            size="small"
                            disabled
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
          </CardContent>
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
            No team members yet
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9ca3af',
            }}
          >
            No team members from your projects. Create a project and add members to collaborate.
          </Typography>
        </Card>
      )}

      {/* Add Member Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.25rem',
        }}>
          Add Team Member
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                },
              },
            }}
          />
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
            onClick={handleAddMember}
            disabled={!email}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

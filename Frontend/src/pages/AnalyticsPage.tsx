import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { apiService } from '@/services/api.service';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/AnalyticsPage.css';

export function AnalyticsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Fetch projects
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await apiService.getProjects();
      return response.data || [];
    },
  });

  // Fetch analytics for selected project
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['analytics', selectedProjectId],
    queryFn: async () => {
      if (!selectedProjectId) return null;
      const response = await apiService.getProjectAnalytics(selectedProjectId);
      return response.data;
    },
    enabled: !!selectedProjectId,
  });

  // Transform data for charts
  const statusData = analytics && analytics.tasksByStatus
    ? Object.entries(analytics.tasksByStatus).map(([key, value]: [string, any]) => ({
        name: key.replace('-', ' ').toUpperCase(),
        value: Number(value),
      }))
    : [];

  const priorityData = analytics && analytics.tasksByPriority
    ? Object.entries(analytics.tasksByPriority).map(([key, value]: [string, any]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: Number(value),
      }))
    : [];

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

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
            Analytics
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6b7280',
              fontSize: '0.95rem',
            }}
          >
            Project statistics and performance insights
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
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
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
          Failed to load analytics. Please try again.
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
          <CircularProgress sx={{ color: '#667eea' }} />
        </Box>
      )}

      {!selectedProjectId ? (
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
            Select a project to view analytics
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9ca3af',
            }}
          >
            Choose a project from the dropdown to see detailed statistics and insights
          </Typography>
        </Card>
      ) : !isLoading && analytics ? (
        <>
          {/* Key Metrics */}
          <Grid container spacing={2.5} sx={{ mb: 5 }}>
            {[
              { label: 'Total Tasks', value: analytics.totalTasks, color: '#667eea', icon: '📊' },
              { label: 'Completed', value: analytics.completedTasks, color: '#10b981', icon: '✓' },
              { label: 'In Progress', value: analytics.pendingTasks, color: '#f59e0b', icon: '⚡' },
              { label: 'Team Members', value: analytics.teamMembers, color: '#3b82f6', icon: '👥' },
            ].map((metric, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card
                  sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-4px)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: metric.color,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#6b7280',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          mb: 1,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {metric.label}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: metric.color,
                          fontWeight: 800,
                        }}
                      >
                        {metric.value}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: '2rem' }}>{metric.icon}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {/* Tasks by Status */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '4px', height: '24px', borderRadius: '2px', background: '#667eea' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                      Tasks by Status
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Tasks by Priority */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: '4px', height: '24px', borderRadius: '2px', background: '#764ba2' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                      Tasks by Priority
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityData}>
                      <CartesianGrid strokeDasharray="0" stroke="#e5e7eb" />
                      <XAxis dataKey="name" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Bar dataKey="value" fill="#764ba2" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Task Distribution */}
          <Card
            sx={{
              borderRadius: '12px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: '4px', height: '24px', borderRadius: '2px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                  Status Distribution
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {statusData.map((item: { name: string; value: number }, index: number) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: '#f8f9ff', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#f0f4ff',
                        borderColor: '#667eea',
                      },
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: COLORS[index % COLORS.length],
                            borderRadius: '4px',
                            flexShrink: 0,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="h6" sx={{ color: COLORS[index % COLORS.length], fontWeight: 700 }}>
                            {item.value}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
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
            No analytics data available
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9ca3af',
            }}
          >
            Create tasks or projects to see analytics data
          </Typography>
        </Card>
      )}
    </Box>
  );
}
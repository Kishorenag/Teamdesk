import { Outlet } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';

export function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <h1 style={{ margin: '0 0 8px' }}>Project Manager</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              Manage your projects efficiently
            </p>
          </Box>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
}

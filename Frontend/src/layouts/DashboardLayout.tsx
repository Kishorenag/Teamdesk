import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/hooks';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export function DashboardLayout() {
  const sidebar = useSidebar();

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar isOpen={sidebar.isOpen} onToggle={sidebar.toggle} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          transition: 'margin-left 0.3s ease-in-out',
          ml: { xs: 0, sm: sidebar.isOpen ? `${SIDEBAR_WIDTH}px` : `${SIDEBAR_COLLAPSED_WIDTH}px` },
        }}
      >
        <Header onSidebarToggle={sidebar.toggle} />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            backgroundColor: '#f5f7fa',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

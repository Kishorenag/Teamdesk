import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import TaskIcon from '@mui/icons-material/Task';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupIcon from '@mui/icons-material/Group';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'Projects', path: '/projects', icon: FolderIcon },
  { label: 'Tasks', path: '/tasks', icon: TaskIcon },
  { label: 'Analytics', path: '/analytics', icon: AnalyticsIcon },
  { label: 'Team', path: '/team', icon: GroupIcon },
];

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with toggle button */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {isOpen && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'white' }}>
            PM Dashboard
          </Typography>
        )}
        <Tooltip title={isOpen ? 'Collapse' : 'Expand'}>
          <IconButton
            onClick={onToggle}
            sx={{
              color: 'white',
              ml: isOpen ? 'auto' : 0,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <Tooltip title={!isOpen ? item.label : ''} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    borderLeft: isActive ? '3px solid white' : '3px solid transparent',
                    color: 'rgba(255,255,255,0.8)',
                    px: isOpen ? 2 : 1,
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                    },
                    '&.active': {
                      color: 'white',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? 'white' : 'rgba(255,255,255,0.8)',
                      minWidth: isOpen ? 40 : 0,
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {isOpen && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      {isOpen && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            © 2024 Project Manager
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        '& .MuiDrawer-paper': {
          width: isOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'width 0.3s ease-in-out',
        },
        display: { xs: 'none', sm: 'block' },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

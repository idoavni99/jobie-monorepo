import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { navBarItems } from './NavItems';

type Properties = {
  onClose?: () => void;
};

export const NAV_DRAWER_WIDTH = 240;
export const NAV_DRAWER_PADDING = 180;

export const AppNavDrawer = ({ onClose }: Properties) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: NAV_DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: NAV_DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        {navBarItems.map(({ name, route, icon }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(route);
                onClose?.();
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
              <ListItemText sx={{ color: 'white' }} primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

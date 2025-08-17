import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_DRAWER_WIDTH } from '../../../hooks/use-nav-drawer-spacing';
import { getCurrentNavItemByPathname, navBarItems } from './NavItems';

type Properties = {
  onClose?: () => void;
};

export const AppNavDrawer = ({ onClose }: Properties) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentLocation = getCurrentNavItemByPathname(location.pathname);

  console.log(currentLocation, navBarItems);
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
              selected={currentLocation === route}
              onClick={() => {
                navigate(route);
                onClose?.();
              }}
            >
              <ListItemIcon
                sx={(theme) => ({
                  color:
                    currentLocation === route
                      ? theme.palette.primary.main
                      : 'inherit',
                })}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                sx={(theme) => ({
                  color:
                    currentLocation === route
                      ? theme.palette.primary.main
                      : 'inherit',
                })}
                primary={name}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

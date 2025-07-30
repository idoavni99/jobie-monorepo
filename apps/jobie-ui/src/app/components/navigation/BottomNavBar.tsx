import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { navBarItems } from './NavItems';

export const BottomNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocation = location.pathname;

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <BottomNavigation
        showLabels
        value={currentLocation}
        onChange={(event, newValue) => navigate(newValue)}
      >
        {navBarItems.map(({ route, icon, name }) => (
          <BottomNavigationAction
            key={name}
            label={name}
            value={route}
            icon={icon}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

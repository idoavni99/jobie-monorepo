import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  useEventCallback,
} from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { AppHeader } from '../AppHeader';
import { AppNavDrawer } from '../navigation/AppNavDrawer';

const container = window !== undefined ? () => window.document.body : undefined;

export const AppLayout = () => {
  const isMobile = useIsMobile();
  const [isNavBarOpenMobile, setIsNavBarOpenMobile] = useState(false);

  const toggleDrawer = useEventCallback(() =>
    setIsNavBarOpenMobile((curr) => !curr)
  );
  return (
    <Stack
      marginBlock={2}
      width={'100%'}
      height={'100%'}
      alignItems={'inherit'}
      gap={3}
    >
      {isMobile ? (
        <>
          <AppBar>
            <Toolbar>
              {isMobile && (
                <IconButton onClick={toggleDrawer}>
                  <MenuIcon />
                </IconButton>
              )}
              <Stack
                width="100%"
                alignItems={isMobile ? 'flex-start' : 'center'}
                paddingInlineStart={isMobile ? 2 : 0}
              >
                <AppHeader />
              </Stack>
            </Toolbar>
          </AppBar>
          <Drawer
            open={isNavBarOpenMobile}
            container={container}
            variant="temporary"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                boxShadow: 3,
              },
            }}
            anchor="left"
          >
            <AppNavDrawer onClose={isMobile ? toggleDrawer : undefined} />
          </Drawer>
        </>
      ) : (
        <AppHeader />
      )}
      <Outlet />
    </Stack>
  );
};

import { AppBar, Toolbar } from '@mui/material';
import { NAV_DRAWER_WIDTH } from '../../../hooks/use-nav-drawer-spacing';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { AppHeader } from '../AppHeader';
import { AppNavDrawer } from '../navigation/AppNavDrawer';

export const AppToolbar = () => {
  const isMobile = useIsMobile();
  return (
    <AppBar
      position="fixed"
      sx={
        isMobile
          ? {}
          : {
              width: `calc(100% - ${NAV_DRAWER_WIDTH}px)`,
              ml: `${NAV_DRAWER_WIDTH}px`,
            }
      }
    >
      <Toolbar>
        <AppHeader titleProps={{ sx: { justifySelf: 'center' } }} />
        {!isMobile && <AppNavDrawer />}
      </Toolbar>
    </AppBar>
  );
};

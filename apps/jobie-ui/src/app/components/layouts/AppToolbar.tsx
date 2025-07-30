import { AppBar, Toolbar } from '@mui/material';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { AppHeader } from '../AppHeader';
import { AppNavDrawer } from '../navigation/AppNavDrawer';

export const AppToolbar = () => {
  const isMobile = useIsMobile();
  return (
    <AppBar position="fixed">
      <Toolbar>
        <AppHeader titleProps={{ sx: { justifySelf: 'center' } }} />
        {!isMobile && <AppNavDrawer />}
      </Toolbar>
    </AppBar>
  );
};

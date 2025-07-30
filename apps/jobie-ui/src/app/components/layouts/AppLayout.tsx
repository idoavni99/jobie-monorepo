import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { BottomNavBar } from '../navigation/BottomNavBar';
import { AppToolbar } from './AppToolbar';

export const AppLayout = () => {
  const isMobile = useIsMobile();
  return (
    <Box display="flex">
      <CssBaseline />
      <AppToolbar />
      <Box marginBlockStart={isMobile ? 8 : 4} flexGrow={1}>
        <Outlet />
      </Box>
      {isMobile && <BottomNavBar />}
    </Box>
  );
};

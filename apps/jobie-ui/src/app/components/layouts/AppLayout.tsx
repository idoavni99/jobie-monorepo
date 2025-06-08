import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { AppToolbar } from './AppToolbar';

export const AppLayout = () => {
  const isMobile = useIsMobile();
  return (
    <>
      <AppToolbar />
      <Box marginBlockStart={isMobile ? 8 : 4}>
        <Outlet />
      </Box>
    </>
  );
};

import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <Stack width={'100%'} height={'100%'} alignItems={'inherit'}>
      <Outlet />
    </Stack>
  );
};

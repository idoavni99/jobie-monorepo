import { Button, Stack, Typography } from '@mui/material';
import { use } from 'react';
import { AuthContext } from '../auth/providers/AuthProvider';

export const HomeScreen = () => {
  const { logout, user } = use(AuthContext);
  return (
    <Stack gap={4}>
      <Typography variant="h3">
        Hello {user?.firstName} {user?.lastName}
      </Typography>
      <Button variant="contained" type="a" href="/roadmap">
        See your roadmap
      </Button>
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
    </Stack>
  );
};

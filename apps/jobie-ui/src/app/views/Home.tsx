import { Button, Stack, Typography } from '@mui/material';
import { use } from 'react';
import { AuthContext } from '../auth/providers/AuthProvider';

export const HomeScreen = () => {
  const { logout, user } = use(AuthContext);
  return (
    <Stack>
      {Object.entries(user ?? {}).map(([key, value]) => (
        <Typography key={key}>
          {key}: {value}
        </Typography>
      ))}
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
    </Stack>
  );
};

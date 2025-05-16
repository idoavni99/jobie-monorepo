import { Button, Stack, Typography } from '@mui/material';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/providers/AuthProvider';

export const HomeScreen = () => {
  const { logout, user } = use(AuthContext);
  const navigate = useNavigate();
  return (
    <Stack gap={4}>
      <Typography variant="h3">
        Hello {user?.firstName} {user?.lastName}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/roadmap')}>
        See your roadmap
      </Button>
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
    </Stack>
  );
};

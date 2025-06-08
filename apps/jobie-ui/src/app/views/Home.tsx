import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store';

export const HomeScreen = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  return (
    <Stack gap={4}>
      <Typography variant="h3">
        Hello {user?.firstName} {user?.lastName}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/roadmap')}>
        See your roadmap
      </Button>
      <Button variant="contained" type="a" href="/edit-profile">
        Edit your profile
      </Button>
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
    </Stack>
  );
};

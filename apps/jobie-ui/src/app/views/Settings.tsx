import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store';

export const Settings = () => {
  const navigate = useNavigate();
  const { user, deleteUser, logout } = useAuthStore();
  const onDeleteUser = async () => {
    if (user?._id) {
      const ok = globalThis.confirm(
        'Are you sure you want to delete the profile?'
      );

      if (!ok) {
        return;
      }
      await deleteUser(user?._id);
      logout();
      navigate('/');
    }
  };

  return (
    <Stack gap={4}>
      <Typography variant="h3">
        Hello {user?.firstName} {user?.lastName}
      </Typography>
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
      <Button variant="contained" color="error" onClick={onDeleteUser}>
        Delete account
      </Button>
    </Stack>
  );
};

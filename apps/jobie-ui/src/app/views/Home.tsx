import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store';
import { RoutesPaths } from '../enums/routes.enum';
import { ConfirmModal } from './components/ConfirmModal';

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, deleteUser, logout } = useAuthStore();
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  const onDeleteUser = async () => {
    if (user?._id) {
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
      <Button variant="contained" onClick={() => navigate('/roadmap')}>
        See your roadmap
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate(RoutesPaths.EDIT_PROFILE)}
      >
        Edit your profile
      </Button>
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
      <Button variant="contained" onClick={() => setDeleteUserModalOpen(true)}>
        Delete account
      </Button>

      <ConfirmModal
        open={isDeleteUserModalOpen}
        confirmText="Yes, Delete my account"
        actionText="
                Once you delete your account, all of your data will be permanently deleted."
        onClose={() => setDeleteUserModalOpen(false)}
        onConfirm={onDeleteUser}
      />
    </Stack>
  );
};

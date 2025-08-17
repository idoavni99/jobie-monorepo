import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store';
import { ConfirmModal } from './components/ConfirmModal';

export const Settings = () => {
  const navigate = useNavigate();
  const { user, deleteUser, logout } = useAuthStore();
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

  return (
    <Stack gap={4}>
      <Typography variant="h3">
        Hello {user?.firstName} {user?.lastName}
      </Typography>
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => setDeleteUserModalOpen(true)}
      >
        Delete account
      </Button>

      <ConfirmModal
        open={isDeleteUserModalOpen}
        confirmText="Yes, Delete my account"
        confirmButtonColor="error"
        actionText="Once you delete your account, all of your data will be permanently deleted."
        onClose={() => setDeleteUserModalOpen(false)}
        onConfirm={deleteUser}
      />
    </Stack>
  );
};

import { Button, Stack, Typography } from '@mui/material';
import { use } from 'react';
import { useAuthStore } from '../auth/store/auth.store';
import { useNavigate } from 'react-router-dom';
import { RoutesPaths } from '../enums/routes.enum';

export const HomeScreen = () => {

  const navigate = useNavigate();
  const { user, refreshUserData, deleteUser, logout } = useAuthStore();
  const onDeleteUser = async () => {
    if(user?._id){
      const ok = globalThis.confirm("Are you sure you wan to delete the profile?")
      console.log(ok);
      
      if(!ok){
        return;
      }
      await deleteUser(user?._id);
      logout();
      navigate('/')

    }
    
  }
  
  return (
    <Stack gap={4}>
      <Typography variant="h3">
        Hello {user?.firstName} {user?.lastName}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/roadmap')}>
        See your roadmap
      </Button>
      <Button variant="contained" onClick={() => navigate(RoutesPaths.EDIT_PROFILE)} >
        Edit your profile
      </Button>
      <Button variant="contained" onClick={logout}>
        Sign Out
      </Button>
      <Button variant="contained" onClick={onDeleteUser}>
        Delete account
      </Button>
    </Stack>
  );
};

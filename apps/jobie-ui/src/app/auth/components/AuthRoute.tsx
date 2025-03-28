import { CircularProgress } from '@mui/material';
import { use } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

export const AuthRoute = () => {
  const { user, isLoadingUserAuth } = use(AuthContext);

  return isLoadingUserAuth ? (
    <CircularProgress />
  ) : user ? (
    <Navigate to={'/'} />
  ) : (
    <Outlet />
  );
};

export const ProtectedRoute = () => {
  const { user, isLoadingUserAuth } = use(AuthContext);

  return isLoadingUserAuth ? (
    <CircularProgress />
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to={`/login`} />
  );
};

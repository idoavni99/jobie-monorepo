import { CircularProgress } from '@mui/material';
import { use, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { user, isLoadingUserAuth } = use(AuthContext);

  useEffect(() => {
    if (
      user?._id &&
      !user?.isProfileSetUp &&
      !globalThis.location.href.includes('/setup-profile')
    ) {
      navigate('/setup-profile');
    }
  }, [user?._id, user?.isProfileSetUp, navigate]);

  return isLoadingUserAuth ? (
    <CircularProgress />
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to={`/login`} />
  );
};

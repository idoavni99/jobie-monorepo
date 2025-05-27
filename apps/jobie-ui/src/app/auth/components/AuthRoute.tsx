import { TUser } from '@jobie/users/types';
import { CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import { RoutesPaths } from '../../enums/routes.enum';
import { useAuthStore } from '../store/auth.store';

const getRoutePathByUserState = (userState: TUser | undefined) => {
  if (!userState) return RoutesPaths.LOGIN;

  const { isProfileSetUp, isRoadmapGenerated } = userState;

  if (!isProfileSetUp && !isRoadmapGenerated) {
    return RoutesPaths.SETUP_PROFILE;
  }

  if (!isRoadmapGenerated) return RoutesPaths.ASPIRATIONS;

  return RoutesPaths.HOME;
};

export const AuthRoute = () => {
  const { user, isLoadingUserAuth } = useAuthStore();

  return isLoadingUserAuth ? (
    <CircularProgress />
  ) : user ? (
    <Navigate to={getRoutePathByUserState(user)} />
  ) : (
    <Outlet />
  );
};

export const ProtectedRoute = () => {
  const { user, isLoadingUserAuth } = useAuthStore();

  return isLoadingUserAuth ? (
    <CircularProgress />
  ) : user?.isProfileSetUp && user.isRoadmapGenerated ? (
    <Outlet />
  ) : (
    <Navigate to={getRoutePathByUserState(user)} />
  );
};

export const SetupRoute = () => {
  const { isProfileSetUp, isLoadingUserAuth, user } = useAuthStore();

  return isLoadingUserAuth ? (
    <CircularProgress />
  ) : !user || (isProfileSetUp && user.isRoadmapGenerated) ? (
    <Navigate to={getRoutePathByUserState(user)} />
  ) : (
    <Outlet />
  );
};

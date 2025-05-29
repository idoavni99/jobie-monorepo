import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import {
  AuthRoute,
  ProtectedRoute,
  SetupRoute,
} from './auth/components/AuthRoute';
import { useAuthStore } from './auth/store/auth.store';
import { AppBackground } from './components/AppBackground';
import { AppLayout } from './components/layouts/AppLayout';
import { SetupLayout } from './components/layouts/SetupLayout';
import { RoutesPaths } from './enums/routes.enum';
import { AspirationsPage } from './views/AspirationsPage';
import { HomeScreen } from './views/Home';
import { Milestone } from './views/milestone/Milestone';
import { NotFound } from './views/NotFound';
import { Register } from './views/Register';
import { Roadmap } from './views/roadmap/Roadmap';
import { SetupProfile } from './views/SetupProfile';
import { SignIn } from './views/SignIn';

export const App = () => {
  const { refreshUserData } = useAuthStore();
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppBackground>
        <Router>
          <Routes>
            {/* Public auth routes */}
            <Route element={<AuthRoute />}>
              <Route element={<SetupLayout />}>
                <Route path={RoutesPaths.REGISTER} element={<Register />} />
                <Route path={RoutesPaths.LOGIN} element={<SignIn />} />
              </Route>
            </Route>

            {/* Setup step if user logged in but not finished setup */}
            <Route element={<SetupRoute />}>
              <Route element={<SetupLayout />}>
                <Route
                  path={RoutesPaths.SETUP_PROFILE}
                  element={<SetupProfile />}
                />

                <Route
                  path={RoutesPaths.ASPIRATIONS}
                  element={<AspirationsPage />}
                />
              </Route>
            </Route>

            {/* Protected routes after full auth and profile setup */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path={RoutesPaths.ROADMAP} element={<Roadmap />} />
                <Route path={RoutesPaths.MILESTONE} element={<Milestone />} />
                <Route path={RoutesPaths.HOME} element={<HomeScreen />} />
              </Route>
            </Route>

            {/* Default route */}
            <Route
              path="/"
              element={<Navigate to={RoutesPaths.HOME} replace />}
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AppBackground>
    </LocalizationProvider>
  );
};

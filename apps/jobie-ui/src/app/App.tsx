import { Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from './auth/components/AuthRoute';
import { AuthProvider } from './auth/providers/AuthProvider';
import { Layout } from './components/Layout';
import { RoutesPaths } from './enums/routes.enum';
import { NotFound } from './views/NotFound';
import { Register } from './views/Register';
import { SetupProfile } from './views/SetupProfile';
import { SignIn } from './views/SignIn';

export const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        width={'inherit'}
        height={'inherit'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Router>
          <AuthProvider>
            <Routes>
              <Route element={<AuthRoute />}>
                <Route path={RoutesPaths.REGISTER} element={<Register />} />
                <Route path={RoutesPaths.LOGIN} element={<SignIn />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route
                    path={RoutesPaths.HOME}
                    element={<div>אבניזזזז</div>}
                  />
                  <Route
                    path={RoutesPaths.SETUP_PROFILE}
                    element={<SetupProfile />}
                  />
                </Route>
              </Route>

              <Route
                path="/"
                element={<Navigate to={RoutesPaths.HOME} replace />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Stack>
    </LocalizationProvider>
  );
};

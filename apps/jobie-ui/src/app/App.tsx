import { Box } from '@mui/material';
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
import { SetupLayout } from './components/SetupLayout';
import { RoutesPaths } from './enums/routes.enum';
import { HomeScreen } from './views/Home';
import { NotFound } from './views/NotFound';
import { Register } from './views/Register';
import { Roadmap } from './views/Roadmap';
import { SetupProfile } from './views/SetupProfile';
import { SignIn } from './views/SignIn';


export const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
        px={2}
      >
        <Router>
          <AuthProvider>
            <Routes>
              <Route element={<AuthRoute />}>
                <Route element={<SetupLayout />}>
                  <Route path={RoutesPaths.REGISTER} element={<Register />} />
                  <Route path={RoutesPaths.LOGIN} element={<SignIn />} />
                  <Route path={RoutesPaths.ROADMAP} element={<Roadmap />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<SetupLayout />}>
                  <Route path={RoutesPaths.HOME} element={<HomeScreen />} />
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
      </Box>
    </LocalizationProvider>
  );
};

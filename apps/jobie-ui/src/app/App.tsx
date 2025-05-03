import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
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
import { AuthProvider } from './auth/providers/AuthProvider';
import { AppBackground } from './components/AppBackground';
import { AppLayout } from './components/layouts/AppLayout';
import { SetupLayout } from './components/layouts/SetupLayout';
import { RoutesPaths } from './enums/routes.enum';
import { AspirationsPage } from './views/AspirationsPage';
import { HomeScreen } from './views/Home';
import { NotFound } from './views/NotFound';
import { Register } from './views/Register';
import { Roadmap } from './views/roadmap/Roadmap';
import { SetupProfile } from './views/SetupProfile';
import { SignIn } from './views/SignIn';

export const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppBackground>
        <Router>
          <AuthProvider>
            <Routes>
              <Route element={<AuthRoute />}>
                <Route element={<SetupLayout />}>
                  <Route path={RoutesPaths.REGISTER} element={<Register />} />
                  <Route path={RoutesPaths.LOGIN} element={<SignIn />} />
                </Route>
              </Route>

              <Route element={<SetupRoute />}>
                <Route element={<SetupLayout />}>
                  <Route path={RoutesPaths.SETUP_PROFILE} element={<SetupProfile />} />


                </Route>
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path={RoutesPaths.ROADMAP} element={<Roadmap />} />
                  <Route path={RoutesPaths.ASPIRATIONS} element={<AspirationsPage />} />
                  <Route path={RoutesPaths.HOME} element={<HomeScreen />} />
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
      </AppBackground>
    </LocalizationProvider>
  );
};

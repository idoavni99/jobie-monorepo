import ArrowBack from '@mui/icons-material/ArrowBack';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '../AppHeader';

export const AppToolbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isOutsideHomepage = location.pathname !== '/';
  return (
    <AppBar>
      <Toolbar>
        {isOutsideHomepage && (
          <IconButton
            sx={{ justifySelf: 'start' }}
            onClick={() =>
              location.key === 'default' ? navigate('/') : navigate(-1)
            }
          >
            <ArrowBack />
          </IconButton>
        )}
        <AppHeader titleProps={{ sx: { justifySelf: 'center' } }} />
      </Toolbar>
    </AppBar>
  );
};

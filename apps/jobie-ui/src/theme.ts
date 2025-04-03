import { createTheme } from '@mui/material/styles';

export const GRADIENT = `linear-gradient(135deg,
      #7D63F5,
      #6E6BF5,
      #657BF2,
      #5C73F0,
      #5581F1,
      #7D63F5)`;

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7D63F5',
    },
    secondary: {
      main: '#5581F1',
    },
    background: {
      default: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: `'Poppins', sans-serif`,
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      letterSpacing: '-0.5px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

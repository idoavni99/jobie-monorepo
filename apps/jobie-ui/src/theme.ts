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
      main: '#6D8CFF',
    },
    secondary: {
      main: '#5581F1',
    },
    background: {
      default: '#657BF2',
      paper: '#7D63F5',
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
          minWidth: 'auto',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '24px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-2px)',
            backgroundColor: '#5C7DE6',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: 'lightpink',
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
    },
  },
});

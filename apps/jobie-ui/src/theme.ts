import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#4caf50',
    },
    gradient: {
      main: 'linear-gradient(90deg, #1976d2, #4caf50)',
    },
  },
});

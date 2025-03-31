import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    background: {
      default: 'linear-gradient(180deg, #5961f0, #682ddb)',
    },
    primary: {
      main: '#3f02b6',
    },
    secondary: {
      main: '#4caf50',
    },
    gradient: {
      main: 'linear-gradient(90deg, #1976d2, #4caf50)',
    },
  },
});

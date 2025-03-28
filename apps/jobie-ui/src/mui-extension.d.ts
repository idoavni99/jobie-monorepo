import '@mui/material';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    gradient?: {
      main: string;
    };
  }

  interface Palette {
    gradient: {
      main: string;
    };
  }
}

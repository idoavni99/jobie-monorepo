import { Box, styled } from '@mui/material';
import { GRADIENT } from '../../theme';

export const AppBackground = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100vw',
  background: GRADIENT,
  animation: `smoothGradientFlow 18s ease-in-out infinite`,
  px: 2,
  '@keyframes smoothGradientFlow': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}));

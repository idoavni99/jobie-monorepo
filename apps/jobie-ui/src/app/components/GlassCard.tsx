import { Card, styled } from '@mui/material';

export const GlassCard = styled(Card)(({ theme }) => ({
  backdropFilter: `blur(20px)`,
  backgroundColor: `rgba(255, 255, 255, 0.07)`,
  boder: `1px solid rgba(255, 255, 255, 0.1)`,
  borderRadius: `21px`,
  padding: `2.618rem`,
  width: `100%`,
  maxWidth: `420px`,
  boxShadow: `0 8px 30px rgba(0, 0, 0, 0.2)`,
  color: ` rgba(255, 255, 255, 0.85)`,
  animation: `fadeIn 0.8s ease-out`,
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: `translateY(20px)`,
    },
    to: {
      opacity: 1,
      transform: `translateY(0)`,
    },
  },
}));

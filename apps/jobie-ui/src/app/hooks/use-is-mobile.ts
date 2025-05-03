import { useMediaQuery } from '@mui/material';

export const useIsMobile = () => {
  const isScreenMobile = useMediaQuery('(max-width: 600px)');

  return isScreenMobile;
};

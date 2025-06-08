import { useMediaQuery } from '@mui/material';

export const useIsMobile = () => {
  const isScreenMobile = useMediaQuery('(max-width: 600px)');
  const isUserAgentMobile = globalThis.navigator.userAgent.includes('Mobile');

  return isScreenMobile || isUserAgentMobile;
};

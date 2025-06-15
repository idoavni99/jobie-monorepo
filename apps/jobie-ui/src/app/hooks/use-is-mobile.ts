import { useMediaQuery } from '@mui/material';
import { useOrientation } from '@uidotdev/usehooks';

export const useIsMobile = () => {
  const isScreenMobile = useMediaQuery('(max-width: 600px)');
  const isUserAgentMobile = globalThis.navigator.userAgent.includes('Mobile');
  const isInPortraitMode = useOrientation().type.includes('portrait');

  return (isScreenMobile || isUserAgentMobile) && isInPortraitMode;
};

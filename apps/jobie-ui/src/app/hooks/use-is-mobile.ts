import { useMediaQuery } from '@mui/material';

export const useIsMobile = (breakpoint = 768) => {
  const isScreenMobile = useMediaQuery(
    `only screen and (max-width : ${breakpoint}px)`
  );

  return isScreenMobile;
};

import { Stack } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { RoutesPaths } from '../../enums/routes.enum';
import { AppHeader, AppHeaderProperties } from '../AppHeader';

const appHeaderPropertiesByPath: Record<string, AppHeaderProperties> = {
  [RoutesPaths.LOGIN]: {
    title: 'Jobie',
    subTitle: 'Sign In',
  },
  [RoutesPaths.REGISTER]: {
    title: 'Jobie',
    subTitle: 'Create Your Account',
  },
  [RoutesPaths.SETUP_PROFILE]: {
    title: 'Setup Your Profile',
    titleProps: { variant: 'h3' },
    subTitle: 'Tell us about your personalized experience',
    subTitleProps: { variant: 'h5' },
  },
};

export const SetupLayout = () => {
  const { pathname } = useLocation();

  return (
    <Stack
      marginBlock={2}
      width={'100%'}
      height={'100%'}
      alignItems={'inherit'}
      gap={3}
    >
      <AppHeader {...appHeaderPropertiesByPath[pathname]} />
      <Outlet />
    </Stack>
  );
};

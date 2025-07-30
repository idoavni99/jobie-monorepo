import TrashIcon from '@mui/icons-material/Delete';
import PencilIcon from '@mui/icons-material/Edit';
import MergeIcon from '@mui/icons-material/Merge';
import SettingsIcon from '@mui/icons-material/Settings';
import { RoutesPaths } from '../../enums/routes.enum';

export const navBarItems = [
  {
    name: 'Settings',
    route: RoutesPaths.SETTINGS,
    icon: <SettingsIcon />,
  },
  {
    name: 'Roadmap',
    route: RoutesPaths.HOME,
    icon: <MergeIcon />,
  },
  {
    name: 'Edit Profile',
    route: RoutesPaths.EDIT_PROFILE,
    icon: <PencilIcon />,
  },
];

export const bottomNavItems = [
  {
    name: 'Delete Account',
    icon: <TrashIcon />,
  },
  {
    name: 'Sign Out',
    icon: <MergeIcon />,
  },
];

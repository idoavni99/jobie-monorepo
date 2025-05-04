import HomeIcon from '@mui/icons-material/Home';
import MergeIcon from '@mui/icons-material/Merge';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RoutesPaths } from '../../enums/routes.enum';

const navBarItems = [
  {
    name: 'Home',
    route: RoutesPaths.HOME,
    icon: <HomeIcon />,
  },
  {
    name: 'Roadmap',
    route: RoutesPaths.ROADMAP,
    icon: <MergeIcon />,
  },
];

type Properties = {
  onClose?: () => void;
};

export const AppNavDrawer = ({ onClose }: Properties) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  return (
    <Stack height="100%" sx={{ background: palette.background.paper }}>
      <List>
        {navBarItems.map(({ name, route, icon }) => (
          <ListItem key={name} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(route);
                onClose?.();
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
              <ListItemText sx={{ color: 'white' }} primary={name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

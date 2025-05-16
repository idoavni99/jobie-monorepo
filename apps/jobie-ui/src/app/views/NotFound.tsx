import HomeIcon from '@mui/icons-material/Home';
import { Button, Card, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Card>
      <Stack alignItems={'center'} my={4} gap={5}>
        <Stack alignItems={'center'} gap={1}>
          <Typography variant="h4">OOPS... Page Not Found</Typography>

          <Typography fontWeight={'light'} fontSize={'large'}>
            The page you are looking for does not exist
          </Typography>
        </Stack>

        <Link to="/">
          <Button
            startIcon={<HomeIcon />}
            variant="contained"
            sx={(theme) => ({
              paddingX: '1rem',
              paddingY: '0.6rem',
            })}
          >
            Go Home
          </Button>
        </Link>
      </Stack>
    </Card>
  );
};

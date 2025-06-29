import { Button, Typography } from '@mui/material';
import { GoogleIcon } from './GoogleIcon';

const handleGoogleAuth = () => {
  globalThis.location.href = `${globalThis.location.origin}/api-gateway/auth/google`;
};

export const GoogleAuthButton = () => {
  return (
    <Button
      fullWidth
      sx={(theme) => ({
        backgroundColor: 'black',
        color: 'white',
        padding: '1rem',
        '&:hover': {
          backgroundColor: theme.palette.grey[900],
        },
      })}
      startIcon={<GoogleIcon />}
      onClick={handleGoogleAuth}
    >
      <Typography fontSize={'small'} fontWeight={400}>
        Log in with Google
      </Typography>
    </Button>
  );
};

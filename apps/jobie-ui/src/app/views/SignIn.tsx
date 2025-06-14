import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store';
import { GlassCard } from '../components/GlassCard';
import { GoogleAuthButton } from '../components/google/GoogleAuthButton';
import { TransparentTextField } from '../components/TransparentTextField';
import { RoutesPaths } from '../enums/routes.enum';
export const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await login(data);
  });

  return (
    <GlassCard>
      <Stack
        gap="1.618rem"
        component="form"
        onSubmit={onSubmit}
        alignItems="center"
      >
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 500,
            fontSize: '1.25rem',
            mb: '0.5rem',
          }}
        >
          Sign In
        </Typography>

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Email"
              fullWidth
              variant="outlined"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          height={56}
          gap={3}
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              padding: '0.618rem 1.2rem',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            {formState.isLoading ? <CircularProgress size={20} /> : 'Sign In'}
          </Button>
          <GoogleAuthButton />
        </Stack>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Don’t have an account?
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate(RoutesPaths.REGISTER)}
            sx={{
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Stack>
    </GlassCard>
  );
};

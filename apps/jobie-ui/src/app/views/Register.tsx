import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useAuthStore } from '../auth/store/auth.store';
import { GlassCard } from '../components/GlassCard';
import { TransparentTextField } from '../components/TransparentTextField';

export const Register = () => {
  const { register } = useAuthStore();

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const onSubmit = handleSubmit(register);

  return (
    <GlassCard>
      <Stack component="form" onSubmit={onSubmit} gap={3} alignItems="center">
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 500,
            fontSize: '1.25rem',
            mb: '0.5rem',
          }}
        >
          Create Your Account
        </Typography>

        <Controller
          control={control}
          name="email"
          rules={{
            required: true,
            pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/,
          }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Email"
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              error={fieldState.invalid}
              helperText={
                fieldState.error && 'This must be a valid email address'
              }
            />
          )}
        />

        <Controller
          control={control}
          name="fullName"
          rules={{
            required: true,
            pattern: /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/,
          }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Full Name"
              fullWidth
              variant="outlined"
              placeholder="Enter your full name"
              error={fieldState.invalid}
              helperText={
                fieldState.error?.type && 'This must be a valid full name'
              }
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: true,
            pattern:
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Password"
              fullWidth
              variant="outlined"
              type="password"
              placeholder="Enter a strong password"
              error={fieldState.invalid}
              helperText={
                fieldState.error?.type &&
                'Must include small and capital letters, numbers, symbols (min 6 chars)'
              }
            />
          )}
        />

        <Box width="62%">
          <Button type="submit" fullWidth variant="contained">
            {formState.isLoading ? <CircularProgress size={20} /> : 'Sign Up'}
          </Button>
        </Box>
      </Stack>
    </GlassCard>
  );
};

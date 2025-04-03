import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../auth/providers/AuthProvider';
import { GlassCard } from '../components/GlassCard';

export const Register = () => {
  const { register } = use(AuthContext);

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
      <Stack
        component="form"
        onSubmit={onSubmit}
        gap="1.618rem"
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
            <TextField
              {...field}
              label="Email"
              fullWidth
              variant="outlined"
              placeholder="Enter your email"
              error={fieldState.invalid}
              helperText={
                fieldState.error && 'This must be a valid email address'
              }
              sx={{
                '& input': {
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.875rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: '#6D8CFF',
                  },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
              InputLabelProps={{ shrink: true }}
              FormHelperTextProps={{ sx: { color: 'lightpink' } }}
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
            <TextField
              {...field}
              label="Full Name"
              fullWidth
              variant="outlined"
              placeholder="Enter your full name"
              error={fieldState.invalid}
              helperText={
                fieldState.error?.type && 'This must be a valid full name'
              }
              sx={{
                '& input': {
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.875rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: '#6D8CFF',
                  },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
              InputLabelProps={{ shrink: true }}
              FormHelperTextProps={{ sx: { color: 'lightpink' } }}
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
            <TextField
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
              sx={{
                '& input': {
                  padding: '0.75rem 1rem',
                  color: '#ffffff',
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '0.875rem',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                  {
                    borderColor: '#6D8CFF',
                  },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '13px',
                },
              }}
              InputLabelProps={{ shrink: true }}
              FormHelperTextProps={{ sx: { color: 'lightpink' } }}
            />
          )}
        />

        <Box width="62%">
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#6D8CFF',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              borderRadius: '34px',
              padding: '0.618rem 1.2rem',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#5C7DE6',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              },
            }}
          >
            {formState.isLoading ? <CircularProgress size={20} /> : 'Sign Up'}
          </Button>
        </Box>
      </Stack>
    </GlassCard>
  );
};

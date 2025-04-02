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
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/providers/AuthProvider';
import { RoutesPaths } from '../enums/routes.enum';

export const SignIn = () => {
  const navigate = useNavigate();
  const { login } = use(AuthContext);

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
    <Box
      className="glass-card"
      sx={{
        padding: '2.618rem',
        maxWidth: '420px',
        width: '100%',
        borderRadius: '21px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
      }}
    >
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
            <TextField
              {...field}
              label="Email"
              fullWidth
              variant="outlined"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
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
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
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
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
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
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
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
            {formState.isLoading ? <CircularProgress size={20} /> : 'Sign In'}
          </Button>
        </Box>

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
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 500,
              borderRadius: '34px',
              padding: '0.4rem 1rem',
              backgroundColor: '#6D8CFF',
              color: '#fff',
              minWidth: 'auto',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              '&:hover': {
                backgroundColor: '#5C7DE6',
              },
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

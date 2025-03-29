import {
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
    <Stack
      component="form"
      gap={3}
      my={4}
      direction="column"
      alignItems={'center'}
      onSubmit={onSubmit}
    >
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextField
            helperText={fieldState.error?.message}
            label="Email:"
            type="email"
            {...field}
            error={fieldState.invalid}
            placeholder="Enter your email"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            helperText={fieldState.error?.message}
            label="Password:"
            type="password"
            {...field}
            error={fieldState.invalid}
            placeholder="Enter a strong password"
          />
        )}
      />

      <Button type="submit" variant="contained" disabled={formState.isLoading}>
        {formState.isLoading ? <CircularProgress /> : 'Sign In'}
      </Button>

      <Stack direction={'row'} alignItems={'center'} gap={0.5}>
        <Typography>Don't have an account yet?</Typography>
        <Button onClick={() => navigate(RoutesPaths.REGISTER)} size={'small'}>
          {formState.isLoading ? <CircularProgress /> : 'Sign Up'}
        </Button>
      </Stack>
    </Stack>
  );
};

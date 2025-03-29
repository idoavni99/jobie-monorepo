import {
  Button,
  CircularProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../auth/providers/AuthProvider';
import { RoutesPaths } from '../enums/routes.enum';
export const SignIn = () => {
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

      <Button type="submit" disabled={formState.isLoading}>
        {formState.isLoading ? <CircularProgress /> : 'Sign In'}
      </Button>

      <Stack direction={'row'} alignItems={'center'} gap={0.5}>
        <Typography>Don't have an account yet?</Typography>
        <Link underline="hover" href={RoutesPaths.REGISTER}>
          <Typography>Sign up</Typography>
        </Link>
      </Stack>
    </Stack>
  );
};

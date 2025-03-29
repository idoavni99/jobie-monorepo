import { Button, Stack, TextField } from '@mui/material';
import { use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../auth/providers/AuthProvider';

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
    <Stack
      component="form"
      onSubmit={onSubmit}
      gap={3}
      my={4}
      alignItems={'center'}
    >
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextField
            helperText={fieldState.error?.message}
            label="Email:"
            type="email"
            {...field}
            placeholder="Enter your email"
            error={fieldState.invalid}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="fullName"
        rules={{ required: true, pattern: /^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/ }}
        render={({ field, fieldState }) => (
          <TextField
            type="text"
            helperText={fieldState.error?.message}
            label="Full Name:"
            {...field}
            placeholder="Enter your full name"
            error={fieldState.invalid}
            required
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
            type="password"
            helperText={fieldState.error?.message}
            label="Password:"
            {...field}
            placeholder="Enter a strong password"
            error={fieldState.invalid}
            required
          />
        )}
      />

      <Button type="submit">Sign Up</Button>
    </Stack>
  );
};

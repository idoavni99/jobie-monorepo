import { Button, Input, Stack } from '@mui/material';
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
        render={({ field, fieldState }) => (
          <Input
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
        render={({ field, fieldState }) => (
          <Input
            type="text"
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
        render={({ field, fieldState }) => (
          <Input
            type="password"
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

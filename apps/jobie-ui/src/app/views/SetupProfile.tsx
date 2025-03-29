import { EnrichedProfileData } from '@jobie/users/types';
import { Button, Stack, TextField } from '@mui/material';
import { use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../auth/providers/AuthProvider';

export const SetupProfile = () => {
  const { control, handleSubmit } = useForm<EnrichedProfileData>({
    defaultValues: {
      bio: '',
      education: '',
      location: '',
      goalJob: '',
    },
  });

  const { setupProfile } = use(AuthContext);
  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(setupProfile)}
      gap={3}
      my={4}
      alignItems={'center'}
    >
      <Controller
        control={control}
        name="goalJob"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextField
            helperText={fieldState.error?.message}
            label={'Goal Job or Specialty'}
            type="text"
            {...field}
            placeholder="E.g. Software Engineer, Marketing Manager"
            error={fieldState.invalid}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="location"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextField
            helperText={fieldState.error?.message}
            label={'Location'}
            type="text"
            {...field}
            placeholder="E.g. New York"
            error={fieldState.invalid}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="education"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextField
            helperText={fieldState.error?.message}
            label={'Educaiton'}
            type="text"
            {...field}
            placeholder="E.g. Masters in Computer Science"
            error={fieldState.invalid}
            required
          />
        )}
      />

      <Controller
        control={control}
        name="bio"
        rules={{ required: true, maxLength: 150 }}
        render={({ field, fieldState }) => (
          <TextField
            helperText={fieldState.error?.message}
            label={'Tell us about yourself (Max 150 characters)'}
            type="text"
            multiline
            {...field}
            placeholder="E.g. AI Enthusiast with 2+ years in Python"
            error={fieldState.invalid}
            required
          />
        )}
      />

      <Button type="submit">Setup Profile</Button>
    </Stack>
  );
};

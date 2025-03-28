import { EnrichedProfileData } from '@jobie/users/types';
import { Button, Input, Stack } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { profileEnrichmentApi } from '../../api/profile-enrichment.api';

export const SetupProfile = () => {
  const { control, handleSubmit } = useForm<EnrichedProfileData>({
    defaultValues: {
      bio: '',
      education: '',
      location: '',
      goalJob: '',
    },
  });

  const onSubmit = handleSubmit((data) => profileEnrichmentApi.post('/', data));
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
        name="goalJob"
        render={({ field, fieldState }) => (
          <Input
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
        render={({ field, fieldState }) => (
          <Input
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
        render={({ field, fieldState }) => (
          <Input
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
        render={({ field, fieldState }) => (
          <Input
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

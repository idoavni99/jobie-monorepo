import { EnrichedProfileData } from '@jobie/users/types';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store/auth.store';
import { GlassCard } from '../components/GlassCard';
import { TransparentTextField } from '../components/TransparentTextField';
import { RoutesPaths } from '../enums/routes.enum';

export const SetupProfile = () => {
  const { setupProfile } = useAuthStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EnrichedProfileData>({
    defaultValues: {
      bio: '',
      education: '',
      location: '',
      goalJob: '',
      linkedinProfileUrl: '',
    },
  });

  const onSubmit = useCallback(
    async (data: EnrichedProfileData) => {
      await setupProfile(data);
      navigate(RoutesPaths.ASPIRATIONS);
    },
    [setupProfile, navigate]
  );

  return (
    <GlassCard sx={{ height: '85dvh' }}>
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        gap={3}
        alignItems="center"
      >
        <Typography
          variant="h4"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 600,
            mb: 2,
          }}
        >
          Complete Your Profile
        </Typography>

        <Controller
          control={control}
          name="goalJob"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Goal Job or Specialty (*)"
              placeholder="e.g. Software Engineer"
              error={fieldState.invalid}
              helperText={fieldState.error && 'Required field'}
              fullWidth
            />
          )}
        />

        <Controller
          control={control}
          name="linkedinProfileUrl"
          rules={{
            required: true,
            pattern:
              /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-_%]+\/?$/,
          }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="LinkedIn Profile (*)"
              placeholder="Paste your LinkedIn URL"
              error={fieldState.invalid}
              helperText={
                fieldState.error?.type && 'Enter a valid LinkedIn profile URL'
              }
              fullWidth
            />
          )}
        />

        <Controller
          control={control}
          name="location"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Location (*)"
              placeholder="e.g. Tel Aviv"
              error={fieldState.invalid}
              helperText={fieldState.error && 'Required field'}
              fullWidth
            />
          )}
        />

        <Controller
          control={control}
          name="education"
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Education (*)"
              placeholder="e.g. BSc in Computer Science"
              error={fieldState.invalid}
              helperText={fieldState.error && 'Required field'}
              fullWidth
            />
          )}
        />

        <Controller
          control={control}
          name="bio"
          rules={{ required: true, maxLength: 150 }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="About You (*)"
              placeholder="Tell us something short (max 150 chars)"
              error={fieldState.invalid}
              helperText={
                fieldState.error
                  ? 'Shorten it to 150 characters'
                  : `${field.value.length} characters`
              }
              sx={{
                '& .MuiFormHelperText-root': {
                  color: fieldState.error ? 'lightpink' : 'lightblue',
                },
              }}
              fullWidth
              multiline
            />
          )}
        />
        <Controller
          control={control}
          name="aspirationalLinkedinUrl"
          rules={{
            required: false,
            pattern:
              /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-_%]+\/?$/,
          }}
          render={({ field, fieldState }) => (
            <TransparentTextField
              {...field}
              label="Aspirational LinkedIn Profile"
              placeholder="Paste your role model’s LinkedIn URL"
              error={fieldState.invalid}
              helperText={
                fieldState.error?.type && 'Must be a valid LinkedIn profile URL'
              }
              fullWidth
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={21} color="inherit" />
          ) : (
            'Save'
          )}
        </Button>
      </Stack>
    </GlassCard>
  );
};

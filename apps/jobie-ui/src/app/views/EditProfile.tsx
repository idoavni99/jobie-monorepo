import { EnrichedProfileUpdateData } from '@jobie/users/types';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RoutesPaths } from '../enums/routes.enum';
import { FormEvent, use } from 'react';
import { Controller, useForm } from 'react-hook-form';
//import { AuthContext } from '../auth/providers/AuthProvider';
import { useAuthStore } from '../auth/store/auth.store'
import { GlassCard } from '../components/GlassCard';
import { TransparentTextField } from '../components/TransparentTextField';

export const EditProfile = () => {
  const {updateProfile , user } = useAuthStore();

  const navigate = useNavigate();

  const onSubmit = async (values: Record<string, any>) => {
    const data: EnrichedProfileUpdateData = {}
    if (values.bio?.length > 0) {
      data.bio = values.bio;
    }
    if (values.education?.length > 0) {
      data.education = values.education;
    }
    if (values.location?.length > 0) {
      data.location = values.location;
    }
    if (values.goalJob?.length > 0) {
      data.goalJob = values.goalJob;
    }
    if (values.linkedinProfileUrl?.length > 0) {
      data.linkedinProfileUrl = values.linkedinProfileUrl;
    }
    if (values.aspirationalLinkedinUrl?.length > 0) {
      data.aspirationalLinkedinUrl = values.aspirationalLinkedinUrl;
    }
    if (values.linkedinHeadline?.length > 0) {
      data.linkedinHeadline = values.linkedinHeadline;
    }

    await updateProfile(data);
    navigate(RoutesPaths.HOME);
  }
  const navigateHome = () => {
    navigate(RoutesPaths.HOME);
  }

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EnrichedProfileUpdateData>({
    defaultValues: {
      bio: user?.bio,
      education: user?.education,
      location: user?.location,
      goalJob: user?.goalJob,
      linkedinProfileUrl: user?.linkedinProfileUrl,
      aspirationalLinkedinUrl: user?.aspirationalLinkedinUrl,
    },

  });
  // TODO Read existing profile data and update GUI
  
  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" px={3}>
      <GlassCard>
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
            Edit Your Profile
          </Typography>

          <Controller
            control={control}
            name="goalJob"
            rules={{ required: false }}
            render={({ field, fieldState }) => (
              <TransparentTextField
                {...field}
                label="Goal Job or Specialty"
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
              required: false,
              pattern:
                /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-_%]+\/?$/,
            }}
            render={({ field, fieldState }) => (
              <TransparentTextField
                {...field}
                label="LinkedIn Profile"
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
            rules={{ required: false }}
            render={({ field, fieldState }) => (
              <TransparentTextField
                {...field}
                label="Location"
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
            rules={{ required: false }}
            render={({ field, fieldState }) => (
              <TransparentTextField
                {...field}
                label="Education"
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
            rules={{ required: false, maxLength: 150 }}
            render={({ field, fieldState }) => (
              <TransparentTextField
                {...field}
                label="About You"
                placeholder="Tell us something short (max 150 chars)"
                error={fieldState.invalid}
                helperText={
                  fieldState.error
                    ? 'Shorten it to 150 characters'
                    : `${field.value?.length} characters`
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
                  fieldState.error?.type &&
                  'Must be a valid LinkedIn profile URL'
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
          <Button variant="contained" type="button" onClick={navigateHome} sx={{
            mt: 2,
            px: 4,
            py: 1.5,
          }}>
            Cancel
          </Button>
        </Stack>
      </GlassCard>
    </Stack>
  );
};

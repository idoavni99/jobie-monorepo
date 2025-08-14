import { EnrichedProfileUpdateData } from '@jobie/users/types';
import {
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { RoutesPaths } from '../enums/routes.enum';
//import { AuthContext } from '../auth/providers/AuthProvider';
import { useState } from 'react';
import { useAuthStore } from '../auth/store/auth.store';
import { GlassCard } from '../components/GlassCard';
import { TransparentTextField } from '../components/TransparentTextField';

type ProfileUpdatePayload = Pick<
  EnrichedProfileUpdateData,
  | 'goalJob'
  | 'linkedinProfileUrl'
  | 'aspirationalLinkedinUrl'
  | 'location'
  | 'education'
  | 'bio'
>;

export const EditProfile = () => {
  const { updateProfile, user } = useAuthStore();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();
  const navigateHome = () => {
    navigate(RoutesPaths.HOME);
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, dirtyFields },
  } = useForm<ProfileUpdatePayload>({
    defaultValues: {
      bio: user?.bio,
      education: user?.education,
      location: user?.location,
      goalJob: user?.goalJob,
      linkedinProfileUrl: user?.linkedinProfileUrl,
      aspirationalLinkedinUrl: user?.aspirationalLinkedinUrl,
    },
  });

  const onSubmit = async (values: ProfileUpdatePayload) => {
    const data: EnrichedProfileUpdateData = {};
    for (const key of Object.keys(dirtyFields)) {
      const propertyKey = key as keyof ProfileUpdatePayload;
      const propertyValue = values[propertyKey];
      if (propertyValue) {
        data[propertyKey] = propertyValue;
      }
    }

    const result = await updateProfile(data);

    if (result.isRoadmapGenerated) {
      navigate(RoutesPaths.ASPIRATIONS);
    } else if (result.message) {
      setMessage(result.message);
      setShowSnackbar(true);
    } else {
      navigate(RoutesPaths.HOME);
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" height="85vh" px={3}>
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
          <Button
            variant="contained"
            type="button"
            onClick={navigateHome}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
            }}
          >
            Cancel
          </Button>
        </Stack>
      </GlassCard>
      <Snackbar
        open={showSnackbar}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => {
          navigate(-1);
          setShowSnackbar(false);
        }}
      />
    </Stack>
  );
};

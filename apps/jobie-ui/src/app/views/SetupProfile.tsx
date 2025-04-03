import { EnrichedProfileData } from '@jobie/users/types';
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../auth/providers/AuthProvider';
import { GlassCard } from '../components/GlassCard';

export const SetupProfile = () => {
  const { setupProfile } = use(AuthContext);

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
      aspirationalLinkedinUrl: '',
    },
  });

  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" px={3}>
      <GlassCard>
        <Stack
          component="form"
          onSubmit={handleSubmit(setupProfile)}
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
              <TextField
                {...field}
                label="Goal Job or Specialty"
                placeholder="e.g. Software Engineer"
                error={fieldState.invalid}
                helperText={fieldState.error && 'Required field'}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ input: { color: '#fff' } }}
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
              <TextField
                {...field}
                label="LinkedIn Profile"
                placeholder="Paste your LinkedIn URL"
                error={fieldState.invalid}
                helperText={
                  fieldState.error?.type && 'Enter a valid LinkedIn profile URL'
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ input: { color: '#fff' } }}
              />
            )}
          />

          <Controller
            control={control}
            name="location"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Location"
                placeholder="e.g. Tel Aviv"
                error={fieldState.invalid}
                helperText={fieldState.error && 'Required field'}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ input: { color: '#fff' } }}
              />
            )}
          />

          <Controller
            control={control}
            name="education"
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Education"
                placeholder="e.g. BSc in Computer Science"
                error={fieldState.invalid}
                helperText={fieldState.error && 'Required field'}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ input: { color: '#fff' } }}
              />
            )}
          />

          <Controller
            control={control}
            name="bio"
            rules={{ required: true, maxLength: 150 }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="About You"
                placeholder="Tell us something short (max 150 chars)"
                error={fieldState.invalid}
                helperText={
                  fieldState.error
                    ? 'Shorten it to 150 characters'
                    : `${field.value.length} characters`
                }
                fullWidth
                multiline
                InputLabelProps={{ shrink: true }}
                sx={{ textarea: { color: '#fff' } }}
              />
            )}
          />
          <Controller
            control={control}
            name="aspirationalLinkedinUrl"
            rules={{
              required: true,
              pattern:
                /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-_%]+\/?$/,
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Aspirational LinkedIn Profile"
                placeholder="Paste your role model’s LinkedIn URL"
                error={fieldState.invalid}
                helperText={
                  fieldState.error?.type &&
                  'Must be a valid LinkedIn profile URL'
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ input: { color: '#fff' } }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              borderRadius: 21,
              px: 5,
              py: 1.5,
              fontWeight: 500,
              backgroundColor: '#5F79ED',
              '&:hover': { backgroundColor: '#4A66DA' },
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
    </Stack>
  );
};

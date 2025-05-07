import { keyframes } from '@emotion/react';
import { TMilestone } from '@jobie/milestone/types';
import {
  Box,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { milestoneMangementApi } from '../../../api/milestone-management.api';
import { useDataFetch } from '../../../hooks/use-data-fetch';
import { MilestoneSkillsList } from './details/MilestoneSkillsList';
import { MilestoneStepsList } from './details/MilestoneStepsList';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Milestone = () => {
  const { milestoneId } = useParams<{ milestoneId: string }>();
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    loading,
    data: milestone,
    fetchData: fetchMilestone,
  } = useDataFetch(() =>
    milestoneMangementApi
      .get<TMilestone>('/', {
        params: { milestoneId },
      })
      .then(({ data }) => data)
  );

  useEffect(() => {
    fetchMilestone();
  }, [fetchMilestone]);

  return (
    <Box p={4} width="100%">
      <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center">
        Milestone Details
      </Typography>

      {loading ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : milestone ? (
        <Box
          sx={{
            animation: `${fadeInUp} 0.6s ease-out`,
            animationFillMode: 'forwards',
            opacity: 0,
            maxWidth: 700,
            mx: 'auto',
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
            {milestone.milestoneName}
          </Typography>

          <Typography
            textAlign="center"
            color={
              milestone.status === 'completed'
                ? 'green'
                : 'rgba(83, 23, 233, 0.77)'
            }
            fontWeight="bold"
            mb={3}
          >
            {milestone.status === 'completed' ? 'Completed' : 'In Progress'}
          </Typography>

          <MilestoneSkillsList skills={milestone.skills} />
          <MilestoneStepsList
            steps={milestone.steps}
            milestoneId={milestone._id}
            status={milestone.status}
            onComplete={() => {
              setShowSnackbar(true);
              milestoneMangementApi
                .post('/generateNext', {
                  CurrentMilestoneId: milestoneId,
                })
                .then(() => {
                  alert('Next milestone generated successfully!');
                })
                .catch((error) => {
                  console.error('Failed to generate next milestone:', error);
                });

              setTimeout(() => {
                navigate(-1);
              }, 2000);
            }}
          />
        </Box>
      ) : (
        <Stack alignItems="center">
          <Typography color="error">
            At least one preceding milestone must be completed before accessing
            this one.
          </Typography>
        </Stack>
      )}

      <Snackbar
        open={showSnackbar}
        message="Milestone completed! Redirecting..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={1500}
      />
    </Box>
  );
};

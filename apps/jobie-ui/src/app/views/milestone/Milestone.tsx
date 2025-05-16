import { keyframes } from '@emotion/react';
import {
  Box,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { MilestoneSkillsList } from './details/MilestoneSkillsList';
import { MilestoneStepsList } from './details/MilestoneStepsList';
import { useMilestoneStore } from './store/milestone-store';

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
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { milestoneId } = useParams<{ milestoneId: string }>() as {
    milestoneId: string;
  };

  const { milestones, fetchMilestone, generateNextMilestone } =
    useMilestoneStore();

  const milestone = milestones[milestoneId];

  useEffect(() => {
    const fetchData = async () => {
      if (!milestone) {
        await fetchMilestone(milestoneId);
      }
    };
    fetchData();
  }, [milestoneId, milestone, fetchMilestone]);

  const handleComplete = async () => {
    setShowSnackbar(true);
    await generateNextMilestone(milestoneId);
  };

  return (
    <Box width="100%">
      <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center">
        Milestone Details
      </Typography>

      {milestone ? (
        <Box
          sx={{
            animation: `${fadeInUp} 0.6s ease-out`,
            animationFillMode: 'forwards',
            opacity: 0,
            maxWidth: isMobile ? 300 : 700,
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
            milestoneId={milestone._id}
            milestoneStatus={milestone.status}
            onComplete={handleComplete}
          />
        </Box>
      ) : (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      <Snackbar
        open={showSnackbar}
        message="Milestone completed! Redirecting..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        onClose={() => {
          navigate(-1);
          setShowSnackbar(false);
        }}
      />
    </Box>
  );
};

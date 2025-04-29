import { keyframes } from '@emotion/react';
import { TMilestone } from '@jobie/milestone/types';
import {
  Box,
  CircularProgress,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { milestoneMangementApi } from '../../api/milestone-management.api';
import { useDataFetch } from '../../hooks/use-data-fetch';

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
  const {
    loading,
    data: milestone,
    fetchData: fetchMilestone,
  } = useDataFetch(() =>
    milestoneMangementApi
      .post<TMilestone>(`/getMilestone`, { milestoneId })
      .then(({ data }) => data)
  );

  useEffect(() => {
    fetchMilestone();
  }, [fetchMilestone]);

  const toggleStep = async (stepId: string, completed: boolean) => {
    try {
      await milestoneMangementApi.patch('/toggleStep', {
        milestoneId,
        stepId,
        completed,
      });
      fetchMilestone(); // Re-fetch the updated milestone after toggling
    } catch (error) {
      console.error('Failed to toggle step', error);
    }
  };

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
          {/* Milestone Name */}
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            textAlign="center"
            color="#333"
          >
            {milestone.milestone_name}
          </Typography>

          {/* Completion Status */}
          <Typography
            textAlign="center"
            color={milestone.completed ? 'green' : 'rgba(83, 23, 233, 0.77)'}
            fontWeight="bold"
            mb={3}
          >
            {milestone.completed ? 'Completed' : 'In Progress'}
          </Typography>

          {/* Skills */}
          <Typography fontWeight="bold" mb={1}>
            Skills Required:
          </Typography>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            gap={1}
            mb={4}
          >
            {milestone.skills.map((skill, index) => (
              <Box
                key={index}
                px={1.5}
                py={0.5}
                fontSize="0.75rem"
                borderRadius="999px"
                bgcolor="rgba(0,0,0,0.05)"
                color="#444"
                sx={{
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}
              >
                {skill}
              </Box>
            ))}
          </Box>

          {/* Steps */}
          <Typography fontWeight="bold" mb={1}>
            Steps to Complete:
          </Typography>
          <Stack spacing={2}>
            {milestone.steps.map((step, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={1}
                sx={{
                  backgroundColor: step.completed
                    ? 'rgba(0,255,0,0.1)'
                    : 'rgba(73, 26, 189, 0.1)',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Box
                  width={12}
                  height={12}
                  borderRadius="50%"
                  bgcolor={step.completed ? 'green' : 'rgba(83, 23, 233, 0.77)'}
                  flexShrink={0}
                />
                <Typography
                  fontSize="0.9rem"
                  color="#333"
                  sx={{
                    textDecoration: step.completed ? 'line-through' : 'none',
                  }}
                >
                  {step.step}
                </Typography>
                <Switch
                  checked={step.completed}
                  onChange={() => toggleStep(step._id, !step.completed)}
                  color="primary"
                  size="small"
                />
              </Box>
            ))}
          </Stack>
        </Box>
      ) : (
        <Stack alignItems="center">
          <Typography color="error">Milestone not found.</Typography>
        </Stack>
      )}
    </Box>
  );
};

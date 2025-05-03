import { keyframes } from '@emotion/react';
import { TRoadmap } from '@jobie/roadmap/types';
import {
  Box,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';
import { useDataFetch } from '../../../hooks/use-data-fetch';
import { MilestonesList } from './milestones/MilestoneList';

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

export const Roadmap = () => {
  const navigate = useNavigate();

  const {
    loading,
    data: milestones,
    fetchData: fetchRoadmap,
  } = useDataFetch(() =>
    roadmapCalibrationApi
      .get<TRoadmap>('/')
      .then(({ data }) => data.milestonesWithSkills ?? [])
  );

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

  useEffect(() => {
    if (!loading && milestones && milestones.length === 0) {
      navigate('/aspirations');
    }
  }, [loading, milestones, navigate]);

  return (
    <Box p={4} width="100%">
      <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center">
        Your Career Roadmap
      </Typography>

      {loading ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <Stack>
          {milestones && <MilestonesList milestones={milestones} />}
          <Box
            sx={{
              height: '2px',
              background: 'linear-gradient(to right, #ffffff33, #ffffff55)',
              zIndex: 1,
            }}
          />
        </Stack>
      )}
    </Box>
  );
};

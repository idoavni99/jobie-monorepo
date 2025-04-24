import { TRoadmap } from '@jobie/roadmap/types';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';
import { useDataFetch } from '../../../hooks/use-data-fetch';
import { MilestonesList } from './milestones/MilestoneList';

export const Roadmap = () => {
  const {
    loading,
    data: milestones,
    fetchData: fetchRoadmap,
  } = useDataFetch(() =>
    roadmapCalibrationApi
      .get<TRoadmap>('/')
      .then(({ data }) => data.milestonesWithSkills)
  );

  const regenerate = async () => {
    try {
      await roadmapCalibrationApi.post('/generate');
      fetchRoadmap();
    } catch (error) {
      console.error('Failed to regenerate roadmap', error);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [fetchRoadmap]);

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
        <Stack gap={2}>
          {/* Line ABOVE the scrollbar */}
          <Box
            sx={{
              height: '2px',
              background: 'linear-gradient(to right, #ffffff33, #ffffff55)',
              zIndex: 1,
            }}
          />
          {milestones && <MilestonesList milestones={milestones} />}
        </Stack>
      )}

      <Stack alignItems="center" mt={6}>
        <Button
          variant="outlined"
          onClick={regenerate}
          sx={{
            borderRadius: 999,
            px: 4,
            py: 1,
            fontWeight: 'bold',
            color: 'white',
            borderColor: 'white',
            backdropFilter: 'blur(6px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Regenerate Roadmap
        </Button>
      </Stack>
    </Box>
  );
};

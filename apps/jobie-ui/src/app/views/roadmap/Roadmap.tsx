import { TMilestone } from '@jobie/milestone/types';
import { TRoadmap } from '@jobie/roadmap/types';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { milestoneMangementApi } from '../../../api/milestone-management.api';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';
import { useDataFetch } from '../../../hooks/use-data-fetch';
import { MilestonesList } from './roadmapMilestones/MilestoneList';

export const Roadmap = () => {
  const {
    loading,
    data: milestones,
    fetchData: fetchRoadmap,
  } = useDataFetch(() =>
    roadmapCalibrationApi.get<TRoadmap>('/').then(async ({ data }) => {
      const { milestones } = data;

      const finalMilestones = await Promise.all(
        milestones.map(async (m) => {
          // If the milestone is active or completed, fetch its steps to calculate progress
          if (m.status === 'active' || m.status === 'completed') {
            try {
              const { data: full } =
                await milestoneMangementApi.get<TMilestone>('/', {
                  params: { milestoneId: m._id },
                });

              const totalSteps = full.steps.length || 1;
              const completedSteps = full.steps.filter(
                (s) => s.completed
              ).length;
              const progress = (completedSteps / totalSteps) * 100;

              return {
                ...m,
                progress,
              };
            } catch (error) {
              console.warn(`Failed to enrich milestone ${m._id}:`, error);
              return {
                ...m,
                progress: 0,
              };
            }
          } else {
            // If the milestone is in 'summary' status (not yet generated), set its progress to 0
            return {
              ...m,
              progress: 0,
            };
          }
        })
      );

      return finalMilestones;
    })
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

      <Stack alignItems="center" mt={2}>
        <Button
          variant="outlined"
          onClick={regenerate}
          size="large"
          sx={{
            color: '#fff',
            borderColor: '#fff',
          }}
        >
          Regenerate Roadmap
        </Button>
      </Stack>
    </Box>
  );
};

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
      // get all Active or Completed milestones from the milestone DB
      try {
        const { data: fullMilestones } = await milestoneMangementApi.get<
          TMilestone[]
        >('/all');

        // create a Map for quick lookup
        const milestoneMap = new Map(fullMilestones.map((m) => [m._id, m]));

        // Iterate over the original milestones and either enrich or set progress to 0
        const finalMilestones = milestones.map((m) => {
          const enriched = milestoneMap.get(m._id);

          if (enriched) {
            // calculate the progress
            const totalSteps = enriched.steps.length || 1;
            const completedSteps = enriched.steps.filter(
              (s) => s.completed
            ).length;
            const progress = (completedSteps / totalSteps) * 100;

            return {
              ...m,
              ...enriched,
              progress,
            };
          }

          // if not enriched, just set progress to 0
          return {
            ...m,
            progress: 0,
          };
        });

        return finalMilestones;
      } catch (error) {
        console.warn(`Failed to fetch milestones:`, error);

        return milestones.map((m) => ({
          ...m,
          progress: 0,
        }));
      }
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

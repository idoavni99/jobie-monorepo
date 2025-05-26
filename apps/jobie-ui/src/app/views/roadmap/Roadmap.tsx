import { TMilestone } from '@jobie/milestone/types';
import { TRoadmap } from '@jobie/roadmap/types';
import {
  Box,
  CircularProgress,
  Stack,
  Typography
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { milestoneMangementApi } from '../../../api/milestone-management.api';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';
import { useDataFetch } from '../../../hooks/use-data-fetch';
import { MilestonesList } from './roadmapMilestones/MilestoneList';

export const Roadmap = () => {
  const navigate = useNavigate();
  const {
    loading,
    data: milestones,
    fetchData: fetchRoadmap,
  } = useDataFetch(() =>
    roadmapCalibrationApi.get<TRoadmap>('/').then(async ({ data }) => {
      const { milestones } = data;
      try {
        const filteredMilestonesIds = milestones
          .filter((m) => m.status === 'active' || m.status === 'completed')
          .map((m) => m._id);

        const { data: fullMilestones } = await milestoneMangementApi.get<TMilestone[]>(
          `/batch?ids=${filteredMilestonesIds.join(',')}`
        );

        const milestoneMap = new Map(fullMilestones.map((m) => [m._id, m]));

        const finalMilestones = milestones.map((m) => {
          const enriched = milestoneMap.get(m._id);
          if (enriched) {
            const totalSteps = enriched.steps.length || 1;
            const completedSteps = enriched.steps.filter((s) => s.completed).length;
            const progress = (completedSteps / totalSteps) * 100;
            return { ...m, progress };
          }
          return { ...m, progress: 0 };
        });

        return finalMilestones;
      } catch (error) {
        console.warn(`Failed to fetch milestones:`, error);
        return milestones.map((m) => ({ ...m, progress: 0 }));
      }
    })
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
    <Box p={4} width="100%" sx={{ overflowX: 'hidden' }}>
      <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center">
        Your Career Roadmap
      </Typography>

      {loading ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        <Box
            sx={{
              overflowX: 'auto',
              width: '100%',
              pb: 4,
            }}
          >
            {milestones && <MilestonesList milestones={milestones} />}
            <Box
              sx={{
                height: '2px',
                background: 'linear-gradient(to right, #ffffff33, #ffffff55)',
                zIndex: 1,
                mt: 2,
              }}
            />
          </Box>
      )}

      <Stack alignItems="center" mt={2}>
        {/* <Button
          variant="outlined"
          onClick={regenerate}
          size="large"
          sx={{
            color: '#fff',
            borderColor: '#fff',
          }}
        >
          Regenerate Roadmap
        </Button> */}
      </Stack>
    </Box>
  );
};

import { TMilestone } from '@jobie/milestone/types';
import { TRoadmap } from '@jobie/roadmap/types';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useWindowSize } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { milestoneMangementApi } from '../../../api/milestone-management.api';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';
import { useDataFetch } from '../../../hooks/use-data-fetch';
import {
  NAV_DRAWER_PADDING,
  NAV_DRAWER_WIDTH,
} from '../../components/navigation/AppNavDrawer';
import { useIsMobile } from '../../hooks/use-is-mobile';
import { MilestonesList } from './roadmapMilestones/MilestoneList';

export const Roadmap = () => {
  const isMobile = useIsMobile();
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

        const { data: fullMilestones } = await milestoneMangementApi.get<
          TMilestone[]
        >(`/batch?ids=${filteredMilestonesIds.join(',')}`);

        const milestoneMap = new Map(fullMilestones.map((m) => [m._id, m]));

        const finalMilestones = milestones.map((m) => {
          const enriched = milestoneMap.get(m._id);
          if (enriched) {
            const totalSteps = enriched.steps.length || 1;
            const completedSteps = enriched.steps.filter(
              (s) => s.completed
            ).length;
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

  const webContainerWidth = useWindowSize().width ?? globalThis.outerWidth;
  return (
    <Box
      p={4}
      width={
        isMobile
          ? '100%'
          : webContainerWidth - (NAV_DRAWER_WIDTH + NAV_DRAWER_PADDING)
      }
    >
      <Typography variant="h4" mb={4} fontWeight="bold" textAlign="center">
        Your Career Roadmap
      </Typography>

      {loading ? (
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
        milestones && (
          <MilestonesList
            milestones={milestones}
            containerWidth={webContainerWidth}
          />
        )
      )}
    </Box>
  );
};

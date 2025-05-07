import { RoadmapMilestone } from '@jobie/roadmap/types';
import { Stack } from '@mui/material';
import { useIsMobile } from '../../../hooks/use-is-mobile';
import { MilestoneListItem } from './MilestoneListItem';

type Properties = {
  milestones: (RoadmapMilestone & { progress: number })[];
};
export const MilestonesList = ({ milestones }: Properties) => {
  const isMobile = useIsMobile();
  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      gap={3}
      alignItems="center"
      overflow="auto"
      sx={{
        scrollBehavior: 'smooth',
        pb: 6,

        ...(isMobile
          ? {
              height: '360px',
            }
          : {
              '&::-webkit-scrollbar': {
                height: 3,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 10,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }),
      }}
    >
      {milestones.map((milestone) => (
        <MilestoneListItem
          key={milestone.milestoneName}
          _id={milestone._id}
          milestoneName={milestone.milestoneName}
          skills={milestone.skills}
          status={milestone.status}
          progress={milestone.progress}
        />
      ))}
    </Stack>
  );
};

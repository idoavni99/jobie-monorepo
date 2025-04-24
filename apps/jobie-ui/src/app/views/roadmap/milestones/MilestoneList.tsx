import { TRoadmap } from '@jobie/roadmap/types';
import { Stack, useMediaQuery } from '@mui/material';
import { MilestoneListItem } from './MilestoneListItem';

type Properties = {
  milestones: TRoadmap['milestonesWithSkills'];
};
export const MilestonesList = ({ milestones }: Properties) => {
  const isMobile = useMediaQuery('(max-width: 600px)');

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
          ? {}
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
          key={milestone.milestone_name}
          milestoneName={milestone.milestone_name}
          skills={milestone.skills}
        />
      ))}
    </Stack>
  );
};

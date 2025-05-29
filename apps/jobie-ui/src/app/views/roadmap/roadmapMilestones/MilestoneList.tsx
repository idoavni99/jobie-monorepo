import { RoadmapMilestone } from '@jobie/roadmap/types';
import { Stack } from '@mui/material';
import { Ref } from 'react';
import { ListProps, Virtuoso } from 'react-virtuoso';
import { useIsMobile } from '../../../hooks/use-is-mobile';
import { MilestoneListItem } from './MilestoneListItem';

type Properties = {
  milestones: (RoadmapMilestone & { progress: number })[];
};

const List: React.FC<ListProps & { ref?: Ref<HTMLDivElement> }> = ({
  style,
  children,
  ref,
}) => {
  const isMobile = useIsMobile();
  return (
    <Stack
      style={{
        ...style,
        display: 'flex',
      }}
      gap={3}
      flexDirection={isMobile ? 'column' : 'row'}
      alignItems="center"
      ref={ref}
    >
      {children}
    </Stack>
  );
};

export const MilestonesList = ({ milestones }: Properties) => {
  const isMobile = useIsMobile();
  return (
    <Virtuoso
      style={{
        height: isMobile ? globalThis.outerHeight : '360px',
        width: isMobile ? '100%' : globalThis.outerWidth,
      }}
      components={{ List }}
      data={milestones}
      totalCount={milestones.length}
      fixedItemHeight={240}
      horizontalDirection={!isMobile}
      itemContent={(_, milestone) => (
        <MilestoneListItem
          key={milestone.milestoneName}
          _id={milestone._id}
          milestoneName={milestone.milestoneName}
          skills={milestone.skills}
          status={milestone.status}
          progress={milestone.progress}
        />
      )}
    />
  );
};

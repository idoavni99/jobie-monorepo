import { Stack } from '@mui/material';
import { useEffect } from 'react';
import { useMilestoneStore } from '../store/milestone-store';
import MilestoneStepItem from './MilestoneStepItem';

type Properties = {
  milestoneId: string;
  milestoneStatus: string;
  onComplete: () => void;
};

export const MilestoneStepsList = ({
  milestoneId,
  milestoneStatus,
  onComplete,
}: Properties) => {
  const { milestones } = useMilestoneStore();
  const milestone = milestones[milestoneId];

  useEffect(() => {
    if (
      milestone &&
      milestone.steps.every((step) => step.completed) &&
      !milestone.hasGeneratedNext
    ) {
      onComplete();
    }
  }, [milestone, onComplete]);

  return (
    <Stack spacing={2}>
      {milestone.steps.map((step) => (
        <MilestoneStepItem
          key={step._id}
          step={step}
          milestoneId={milestoneId}
          disabled={milestoneStatus === 'completed'}
        />
      ))}
    </Stack>
  );
};

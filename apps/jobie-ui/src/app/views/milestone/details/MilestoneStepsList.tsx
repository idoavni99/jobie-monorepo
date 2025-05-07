import { MilestoneStep } from '@jobie/milestone/types';
import { Box, Stack, Switch, Typography } from '@mui/material';
import { useState } from 'react';
import { milestoneMangementApi } from '../../.././../api/milestone-management.api';

type Properties = {
  steps: MilestoneStep[];
  milestoneId: string;
  status: string;
  onComplete: () => void;
};

export const MilestoneStepsList = ({
  steps,
  milestoneId,
  status,
  onComplete,
}: Properties) => {
  const [localSteps, setLocalSteps] = useState(steps);

  const toggleStep = async (stepId: string, completed: boolean) => {
    try {
      await milestoneMangementApi.patch('/toggleStep', {
        milestoneId,
        stepId,
        completed,
      });
      const updatedSteps = localSteps.map((step) =>
        step._id === stepId ? { ...step, completed } : step
      );
      setLocalSteps(updatedSteps);

      // check if all steps are now completed
      if (updatedSteps.every((step) => step.completed)) {
        onComplete();
      }
    } catch (error) {
      console.error('Failed to toggle step', error);
    }
  };

  return (
    <Stack spacing={2}>
      {localSteps.map((step) => (
        <Box
          key={step._id}
          display="flex"
          alignItems="center"
          gap={1}
          sx={{
            backgroundColor: step.completed
              ? 'rgba(0,255,0,0.1)'
              : 'rgba(73, 26, 189, 0.1)',
            p: 2,
            borderRadius: 2,
          }}
        >
          <Box
            width={12}
            height={12}
            borderRadius="50%"
            bgcolor={step.completed ? 'green' : 'rgba(83, 23, 233, 0.77)'}
            flexShrink={0}
          />
          <Typography
            fontSize="0.9rem"
            color="#333"
            sx={{
              textDecoration: step.completed ? 'line-through' : 'none',
            }}
          >
            {step.step}
          </Typography>
          <Switch
            checked={step.completed}
            onChange={() => toggleStep(step._id, !step.completed)}
            color="primary"
            size="small"
            disabled={status === 'completed'}
          />
        </Box>
      ))}
    </Stack>
  );
};

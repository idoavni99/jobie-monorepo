// MilestoneStepItem.tsx
import { MilestoneStep } from '@jobie/milestone/types';
import { Box, Switch, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { memo, useCallback } from 'react';
import { useMilestoneStore } from '../store/milestone-store';
type Properties = {
  step: MilestoneStep;
  milestoneId: string;
  disabled: boolean;
};

const MilestoneStepItem = memo(
  ({ step, milestoneId, disabled }: Properties) => {
    const { toggleStep } = useMilestoneStore();

    const handleToggle = useCallback(() => {
      toggleStep(milestoneId, step._id, !step.completed);
    }, [milestoneId, step._id, step.completed, toggleStep]);

    const urlMatch = step.step.match(/(https?:\/\/[^\s]+)$/);
    const url = urlMatch ? urlMatch[1] ?? urlMatch[0] : '';
    const description = step.step.replace(url, '').trim();

    return (
      <Box
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
        <Box flex={1}>
          <Typography
            fontSize="0.9rem"
            color="#333"
            sx={{
              textDecoration: step.completed ? 'line-through' : 'none',
              whiteSpace: 'pre-wrap',
            }}
          >
            {description}
          </Typography>
          {url && (
            <Link
              href={url.trim()}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="0.8rem"
              color="primary"
              underline="hover"
              sx={{
                display: 'inline-block',
                mt: 0.5,
              }}
            >
              Open Resource
            </Link>
          )}
        </Box>
        <Switch
          checked={step.completed}
          onChange={handleToggle}
          color="primary"
          size="small"
          disabled={disabled}
        />
      </Box>
    );
  }
);

export default MilestoneStepItem;

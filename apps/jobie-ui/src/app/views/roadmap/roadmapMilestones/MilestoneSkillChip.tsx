import { Chip } from '@mui/material';

type Properties = {
  skill: string;
};

export const MilestoneSkillChip = ({ skill }: Properties) => {
  return <Chip label={skill} />;
};

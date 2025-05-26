import { Stack } from '@mui/material';
import { MilestoneSkillChip } from './MilestoneSkillChip';

export type Properties = {
  skills: string[];
};

export const MilestoneSkillsList = ({ skills }: Properties) => {
  return (
    <Stack>
      {skills.map((skill) => (
        <MilestoneSkillChip key={skill} skill={skill} />
      ))}
    </Stack>
  );
};

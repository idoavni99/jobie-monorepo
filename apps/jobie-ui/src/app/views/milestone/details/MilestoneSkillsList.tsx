import { Stack } from '@mui/material';
import { MilestoneSkillChip } from '../../roadmap/roadmapMilestones/MilestoneSkillChip';

export type Properties = {
  skills: string[];
};

export const MilestoneSkillsList = ({ skills }: Properties) => {
  return (
    <Stack direction="row" spacing={1} mb={4} justifyContent="center">
      {skills.map((skill) => (
        <MilestoneSkillChip key={skill} skill={skill} />
      ))}
    </Stack>
  );
};

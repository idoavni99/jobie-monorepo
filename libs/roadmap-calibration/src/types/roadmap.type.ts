export type MilestoneWithSkills = {
  milestone_name: string;
  skills: string[];
};

export type TRoadmap = {
  userId: string;
  goalJob: string;
  summarizedMilestones: string[];
  milestonesWithSkills: MilestoneWithSkills[];
  milestoneIds: string[];
};

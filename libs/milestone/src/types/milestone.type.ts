export type MilestoneStep = { _id: string; step: string; completed: boolean };

export type TMilestone = {
  _id: string; // milestone id
  userId: string; // user id of the creator
  milestone_name: string; // name of the milestone
  skills: string[]; // skills required for the milestone
  steps: MilestoneStep[]; // steps to complete the milestone
  completed: boolean; // whether the milestone is completed or not
};

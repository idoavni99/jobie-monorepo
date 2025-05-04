export type MilestoneStep = { _id: string; step: string; completed: boolean };

export type TMilestone = {
  _id: string; // milestone id
  milestoneName: string; // name of the milestone
  skills: string[]; // skills required for the milestone
  steps: MilestoneStep[]; // steps to complete the milestone
  status: 'summary' | 'active' | 'completed'; // status of the milestone
  hasGeneratedNext: boolean; // if the next milestone has been generated
};

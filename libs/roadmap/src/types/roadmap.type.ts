export type RoadmapMilestoneStatus = 'summary' | 'active' | 'completed';

export type RoadmapMilestone = {
  _id: string;
  milestoneName: string;
  skills: string[];
  status: RoadmapMilestoneStatus;
};

export type TRoadmap = {
  userId: string;
  goalJob: string;
  milestones: RoadmapMilestone[];
  isApproved: boolean;
};

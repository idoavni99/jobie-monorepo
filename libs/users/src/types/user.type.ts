export type EnrichedProfileData = {
  goalJob: string;
  location: string;
  education: string;
  bio: string;
  linkedinProfileUrl: string;
  aspirationalLinkedinUrl?: string;
  skills: string[];
  experienceSummary: { title: string; companyName: string }[];
  linkedinHeadline: string;
  linkedinFullName?: string;
  linkedinProfilePictureUrl?: string;
  linkedinLocation?: string;
  linkedinPositions?: {
    title: string;
    companyName: string;
    startDate: string;
    endDate: string;
  }[];
  linkedinEducations?: {
    schoolName: string;
    degreeName: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
};
export type EnrichedProfileUpdateData = {
  goalJob?: string;
  location?: string;
  education?: string;
  bio?: string;
  linkedinProfileUrl?: string;
  aspirationalLinkedinUrl?: string;
  skills?: string[];
  experienceSummary?: { title: string; companyName: string }[];
  linkedinHeadline?: string;
};
export type UserData = {
  _id: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  isProfileSetUp: boolean;
  isRoadmapGenerated: boolean;
};
export type TUser = UserData & Partial<EnrichedProfileData>;

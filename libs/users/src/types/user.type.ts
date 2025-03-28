export type EnrichedProfileData = {
  goalJob: string;
  location: string;
  education: string;
  bio: string;
};
export type UserData = {
  _id: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  isProfileSetUp: boolean;
};
export type TUser = UserData & Partial<EnrichedProfileData>;

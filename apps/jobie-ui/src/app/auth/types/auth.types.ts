import { EnrichedProfileData, EnrichedProfileUpdateData, TUser } from '@jobie/users/types';

export type AuthContextValue = {
  user?: TUser;
  isLoadingUserAuth: boolean;
  isLoadingAuthFormResponse: boolean;
  login: (userCredentials: Pick<TUser, 'email' | 'password'>) => Promise<void>;
  register: (
    registrationData: Pick<TUser, 'email' | 'password'> & {
      fullName: string;
    }
  ) => Promise<void>;
  setupProfile: (data: EnrichedProfileData) => Promise<void>;
  updateProfile: (data: EnrichedProfileUpdateData) => Promise<void>;
  logout: () => Promise<void>;
  getUserMe: () => Promise<void>;
};

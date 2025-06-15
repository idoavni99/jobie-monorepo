import { EnrichedProfileData, TUser } from '@jobie/users/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { gatewayApi } from '../../../api/gateway.api';
import { profileEnrichmentApi } from '../../../api/profile-enrichment.api';
import { EnrichedProfileUpdateData } from '@jobie/users/types';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';

type AuthState = {
  user?: TUser;
  isLoadingUserAuth: boolean;
  refreshUserData: () => Promise<void>;
  login: (userCredentials: Pick<TUser, 'email' | 'password'>) => Promise<void>;
  logout: () => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateProfile: (updateData: EnrichedProfileUpdateData) => Promise<void>;
  register: (
    registrationData: Pick<TUser, 'email' | 'password'> & { fullName: string }
  ) => Promise<void>;
  setupProfile: (data: EnrichedProfileData) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: undefined,
      isLoadingUserAuth: true,
      refreshUserData: async () => {
        try {
          const { data: user } = await gatewayApi.get<TUser>('/me');
          set({ user, isLoadingUserAuth: false });
        } catch {
          set({ user: undefined, isLoadingUserAuth: false });
        }
      },
      login: async (userCredentials) => {
        set({ isLoadingUserAuth: true });
        try {
          const { data: user } = await gatewayApi.post<TUser>(
            '/login',
            userCredentials
          );
          set({ user, isLoadingUserAuth: false });
        } catch {
          set({ isLoadingUserAuth: false });
        }
      },
      logout: async () => {
        await gatewayApi.post('/logout');
        set({ user: undefined, isLoadingUserAuth: false });
      },
      deleteUser: async (userId: string) => {
        await roadmapCalibrationApi.delete<TUser>('/'); // TODO: Uncomment when the API is ready
        await profileEnrichmentApi.delete('/');

      },
      updateProfile: async (updateData: EnrichedProfileUpdateData) => {
        const response = await profileEnrichmentApi.put<TUser>("/", updateData);
        // TODO call roadmap-callibration / regenerate
        // retrieve the user since TUser is like ansi-c union
        await roadmapCalibrationApi.post('/regenerate', updateData);
        const updatedData = response.data;
       set({user:updatedData})

      },

      register: async (registrationData) => {
        set({ isLoadingUserAuth: true });
        try {
          const { data: user } = await gatewayApi.post<TUser>(
            '/register',
            registrationData
          );
          set({ user, isLoadingUserAuth: false });
        } catch {
          set({ isLoadingUserAuth: false });
        }
      },
      setupProfile: async (setupData) => {
        const { data: user } = await profileEnrichmentApi.post<TUser>(
          '/',
          setupData
        );
        set({ user });
      },
    }),
    { name: 'AuthStore', enabled: import.meta.env['DEV'] }
  )
);

import {
  EnrichedProfileData,
  EnrichedProfileUpdateData,
  TUser,
} from '@jobie/users/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { gatewayApi } from '../../../api/gateway.api';
import { milestoneMangementApi } from '../../../api/milestone-management.api';
import { profileEnrichmentApi } from '../../../api/profile-enrichment.api';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';

type AuthState = {
  user?: TUser;
  isLoadingUserAuth: boolean;
  refreshUserData: () => Promise<void>;
  login: (userCredentials: Pick<TUser, 'email' | 'password'>) => Promise<void>;
  logout: () => Promise<void>;
  deleteUser: () => Promise<void>;
  updateProfile: (
    updateData: EnrichedProfileUpdateData
  ) => Promise<{ isRoadmapGenerated: boolean; message: string }>;
  register: (
    registrationData: Pick<TUser, 'email' | 'password'> & { fullName: string }
  ) => Promise<void>;
  setupProfile: (data: EnrichedProfileData) => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
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
      deleteUser: async () => {
        await Promise.all([
          roadmapCalibrationApi.delete('/'),
          milestoneMangementApi.delete('/'),
        ]);

        await gatewayApi.delete('/me');

        set({ user: undefined, isLoadingUserAuth: false });
      },
      updateProfile: async (updateData: EnrichedProfileUpdateData) => {
        const { data: updatedProfile } = await profileEnrichmentApi.put<TUser>(
          '/',
          updateData
        );
        set({ user: updatedProfile });

        if (updateData.goalJob || updateData.aspirationalLinkedinUrl) {
          try {
            // extract skills to user and delete roadmap
            await roadmapCalibrationApi.post('/regenerate', updateData);

            set({
              user: {
                ...updatedProfile,
                isRoadmapGenerated: true,
              },
            });
            return { isRoadmapGenerated: true };
          } catch (error) {
            const axiosError = error as {
              response: { data: { message: string } };
            };
            return {
              message: axiosError.response.data.message,
              isRoadmapGenerated: false,
            };
          }
        }

        return {
          isRoadmapGenerated: false,
        };
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

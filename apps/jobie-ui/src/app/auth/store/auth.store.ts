import { EnrichedProfileData, TUser } from '@jobie/users/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { gatewayApi } from '../../../api/gateway.api';
import { profileEnrichmentApi } from '../../../api/profile-enrichment.api';

type AuthState = {
  user?: TUser;
  isLoadingUserAuth: boolean;
  isProfileSetUp: boolean;
  refreshUserData: () => Promise<void>;
  login: (userCredentials: Pick<TUser, 'email' | 'password'>) => Promise<void>;
  logout: () => Promise<void>;
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
        const { data: user } = await gatewayApi.post<TUser>(
          '/login',
          userCredentials
        );
        set({ user, isLoadingUserAuth: false });
      },
      logout: async () => {
        await gatewayApi.post('/logout');
        set({ user: undefined, isLoadingUserAuth: true });
      },
      register: async (registrationData) => {
        set({ isLoadingUserAuth: true });
        const { data: user } = await gatewayApi.post<TUser>(
          '/register',
          registrationData
        );
        set({ user, isLoadingUserAuth: false });
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

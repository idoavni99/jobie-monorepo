import { EnrichedProfileData, TUser } from '@jobie/users/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { gatewayApi } from '../../../api/gateway.api';
import { profileEnrichmentApi } from '../../../api/profile-enrichment.api';
import { EnrichedProfileUpdateData } from '@jobie/users/types';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';
import { Roadmap } from '@jobie/roadmap/nestjs';

type AuthState = {
  success: boolean;
  message:string;
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

type RoadmapRegenrationResponse={
  roadmap:Roadmap, completedSkills:string[]
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      success:true,
      message:'',
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
        const previousProfile = useAuthStore.getState().user;
        if (!previousProfile) {
          throw new Error('User profile not found');
        }
        console.log('updateData', updateData);
        
        if(previousProfile.goalJob !== updateData.goalJob ) {
          //updateData.goalJob = ""
          previousProfile.isRoadmapGenerated = false;
          // 4
           // await this.usersRepository.update(user._id, {aspirationalLinkedinUrl: body.aspirationalLinkedinUrl,isRoadmapGenerated: true,});
        }
        //updateData.aspirationalLinkedinUrl = ""; cannot delete asiration since it is needed for roadmap regeneration
        // if aspirationalLinkedinUrl was changed, do we need to regenerate (even if 14 days did not pass)

        const response = await profileEnrichmentApi.put<TUser>("/", updateData);
        // TODO call roadmap-callibration / regenerate
        // retrieve the user since TUser is like ansi-c union
        try{
          const regenerationResponse:RoadmapRegenrationResponse|null = await roadmapCalibrationApi.post('/regenerate', {enrichedProfile:updateData});
          console.log(regenerationResponse)
          set({success:true, message:""})
        }catch(error){
            const axiosError = error as {response:{data:{message:string}}}
            console.log(axiosError.response.data.message);
            set({success:false, message:axiosError.response.data.message})
        }
        
        
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

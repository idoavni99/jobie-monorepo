import { EnrichedProfileData, TUser } from '@jobie/users/types';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { gatewayApi } from '../../../api/gateway.api';
import { profileEnrichmentApi } from '../../../api/profile-enrichment.api';
import { roadmapCalibrationApi } from '../../../api/roadmap-calibration.api';
import { AuthContextValue } from '../types/auth.types';

export const AuthContext = createContext<AuthContextValue>(
  undefined as unknown as AuthContextValue
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<TUser>();
  const [isLoadingUserAuth, setIsLoadingUserAuth] = useState(true);
  const [isLoadingAuthFormResponse, setIsLoadingAuthFormResponse] =
    useState(false);

  const navigate = useNavigate();

  const getUserMe = useCallback(async () => {
    try {
      setIsLoadingUserAuth(true);

      const { data: user } = await gatewayApi.get<TUser | undefined>('/me');

      setUser(user);
    } catch (error) {
      console.error('Get User Me went wrong', error);
    } finally {
      setIsLoadingUserAuth(false);
    }
  }, [setUser, setIsLoadingUserAuth]);

  useEffect(() => {
    if (!user?._id) {
      getUserMe();
    }
  }, [user?._id, getUserMe]);

  // const onAuthenticationSuccess = async (rawUser: TUser) => {
  //   setUser(rawUser);

  //   try {
  //     const { data: roadmap } = await roadmapCalibrationApi.get('/');

  //     if (roadmap) {
  //       navigate('/roadmap'); // User already approved a roadmap
  //     } else {
  //       navigate('/aspirations'); // User needs to choose a role model
  //     }
  //   } catch (error) {
  //     console.error('Error checking user roadmap', error);
  //     navigate('/aspirations'); // Default fallback
  //   }
  // };


  // const onAuthenticationSuccess = (rawUser: TUser) => {
  //   setUser(rawUser);
  //   navigate('/');
  // };


  const onAuthenticationSuccess = async (rawUser: TUser) => {
    setUser(rawUser);

    if (!rawUser.isProfileSetUp) {
      // User didn't even set up profile yet
      navigate('/setup-profile');
      return;
    }

    try {
      const { data: roadmap } = await roadmapCalibrationApi.get('/');

      if (roadmap && Object.keys(roadmap).length > 0) {
        navigate('/roadmap');
      } else {
        navigate('/aspirations');
      }
    } catch (error) {
      console.error('Error checking user roadmap', error);
      navigate('/setup-profile'); // Fallback, very safe
    }
  };




  const login = async (userLoginData: Pick<TUser, 'email' | 'password'>) => {
    setIsLoadingAuthFormResponse(true);

    await gatewayApi
      .post<TUser>('/login', userLoginData)
      .then(({ data }) => {
        onAuthenticationSuccess(data);
      })
      .finally(() => setIsLoadingAuthFormResponse(false));
  };

  const register = async (
    registrationDTO: Pick<TUser, 'email' | 'password'> & {
      fullName: string;
    }
  ) => {
    setIsLoadingAuthFormResponse(true);

    await gatewayApi.post<TUser>('/register', registrationDTO);
    await login({
      email: registrationDTO.email,
      password: registrationDTO.password,
    });
  };

  const setupProfile = async (data: EnrichedProfileData) => {

    const { data: updatedUser } = await profileEnrichmentApi.post<TUser>(
      '/',
      data
    );

    const { data: suggestions } = await roadmapCalibrationApi.post(
      '/suggest-aspirations',
      {
        targetUrl: data.aspirationalLinkedinUrl,
        maxResults: 4,
      }
    );

    setUser(updatedUser);

    navigate('/aspirations', {
      state: {
        suggestions,
        aspirationalLinkedinUrl: data.aspirationalLinkedinUrl,
      },
    });
  };

  const logout = async () => {
    await gatewayApi.post('/logout');
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoadingUserAuth,
        getUserMe,
        setupProfile,
        isLoadingAuthFormResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

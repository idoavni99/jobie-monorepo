import { EnrichedProfileData, EnrichedProfileUpdateData, TUser } from '@jobie/users/types';
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

  const onAuthenticationSuccess = (rawUser: TUser) => {
    setUser(rawUser);
    navigate('/');
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
    await roadmapCalibrationApi.post('/generate');
    onAuthenticationSuccess(updatedUser);
  };
  const updateProfile = async (data: EnrichedProfileUpdateData) => {
    const { data: updatedUser } = await profileEnrichmentApi.put<TUser>(
      '/',
      data
    );
    await roadmapCalibrationApi.post('/generate');
    onAuthenticationSuccess(updatedUser);
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
        updateProfile,
        isLoadingAuthFormResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

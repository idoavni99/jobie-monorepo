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

      const { data: user } = await gatewayApi.get<TUser | undefined>(
        '/auth/me'
      );

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
      .post<TUser>('/auth/login', userLoginData)
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

    await gatewayApi.post<TUser>('/auth/register', registrationDTO);
    await login({
      email: registrationDTO.email,
      password: registrationDTO.password,
    });
  };

  const setupProfile = async (data: EnrichedProfileData) => {
    const { data: updatedUser } = await gatewayApi.post<TUser>(
      '/user-profile-enrichment',
      data
    );
    onAuthenticationSuccess(updatedUser);
  };

  const logout = async () => {
    await gatewayApi.post('/auth/logout');
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

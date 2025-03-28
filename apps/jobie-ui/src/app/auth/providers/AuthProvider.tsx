import { TUser } from '@jobie/users/types';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../api/auth.api';
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

  const saveUser = useCallback((rawUser?: TUser) => {
    if (!rawUser) {
      setUser(undefined);

      return;
    }

    setUser(rawUser);
  }, []);

  const getUserMe = useCallback(async () => {
    try {
      setIsLoadingUserAuth(true);

      const { data: user } = await authApi.get<TUser | undefined>('/me');

      saveUser(user);
    } catch (error) {
      console.error('Get User Me went wrong', error);
    } finally {
      setIsLoadingUserAuth(false);
    }
  }, [saveUser]);

  useEffect(() => {
    if (!user) {
      getUserMe();
    }
  }, [getUserMe, user]);

  const onAuthenticationSuccess = useCallback(
    (rawUser: TUser) => {
      saveUser(rawUser);
      navigate('/');
    },
    [navigate, saveUser]
  );

  const login = useCallback(
    async (userLoginData: Pick<TUser, 'email' | 'password'>) => {
      setIsLoadingAuthFormResponse(true);

      await authApi
        .post<TUser>('/login', userLoginData)
        .then(({ data }) => {
          onAuthenticationSuccess(data);
        })
        .finally(() => setIsLoadingAuthFormResponse(false));
    },
    [onAuthenticationSuccess]
  );

  const register = useCallback(
    async (
      registrationDTO: Pick<TUser, 'email' | 'password'> & {
        fullName: string;
      }
    ) => {
      setIsLoadingAuthFormResponse(true);

      await authApi
        .post<TUser>('/register', registrationDTO)
        .then(({ data }) => {
          onAuthenticationSuccess(data);
        })
        .finally(() => setIsLoadingAuthFormResponse(false));
    },
    [onAuthenticationSuccess]
  );

  const logout = useCallback(async () => {
    await authApi.post('/logout');
    navigate('/');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoadingUserAuth,
        getUserMe,
        isLoadingAuthFormResponse,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

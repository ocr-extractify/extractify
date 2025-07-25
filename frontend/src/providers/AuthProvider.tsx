import {
  useMemo,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { httpClient } from '@/utils/axios';
import { UserAuth, AccessToken } from '@/utils/types/api/auth';
import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { APIUser } from '@/utils/types/api/user';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  isAuthenticated?: boolean | null;
  setIsAuthenticated: (value?: boolean | null) => void;
  signin: (data: UserAuth) => Promise<void>;
  signup: (data: UserAuth) => Promise<void>;
  signout: () => Promise<void>;
  user?: APIUser | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<
    boolean | null | undefined
  >('isAuthenticated', false);
  const [user, setUser] = useLocalStorage<APIUser | null>('user', null);

  // keep user data updated
  useEffect(() => {
    if (isAuthenticated) {
      httpClient
        .get('/auth/me/')
        .then((res: AxiosResponse<APIUser>) => {
          setUser(res.data);
        })
        .catch(() => {
          setUser(null);
          setIsAuthenticated(null);
          Cookies.remove('jwt_token');
        });
    }
  }, [isAuthenticated]);

  // check if exist a cookie
  useEffect(() => {
    if (Cookies.get('jwt_token')) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  const signup = useCallback(
    async (data: UserAuth) => {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('password', data.password);

      return httpClient
        .post('/auth/signup/', formData)
        .then((res: AxiosResponse<AccessToken>) => {
          const token = res.data.access_token;

          Cookies.set('jwt_token', token, {
            secure: false,
            sameSite: 'Strict',
          });
          setIsAuthenticated(true);

          httpClient.get('/auth/me/').then((res: AxiosResponse<APIUser>) => {
            setUser(res.data);
          });
        });
    },
    [setIsAuthenticated, setUser],
  );

  const signin = useCallback(
    async (data: UserAuth) => {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('password', data.password);

      return httpClient
        .post('/auth/signin/', formData)
        .then((res: AxiosResponse<AccessToken>) => {
          const token = res.data.access_token;

          Cookies.set('jwt_token', token, {
            secure: false,
            sameSite: 'Strict',
          });
          setIsAuthenticated(true);

          httpClient.get('/auth/me/').then((res: AxiosResponse<APIUser>) => {
            setUser(res.data);
          });
        })
        .catch((err) => {
          toast({
            title: err.response.data.detail, // t("PREFERENCES_UPDATED"),
          });
          throw err;
        });
    },
    [setIsAuthenticated, setUser],
  );

  const signout = useCallback(async () => {
    setIsAuthenticated(null);
    Cookies.remove('jwt_token');
    setUser(null);
    window.location.reload();
  }, [setIsAuthenticated, setUser]);

  console.log('user', user);
  const value = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      signin,
      signup,
      signout,
      user,
    }),
    [isAuthenticated, setIsAuthenticated, signin, signup, signout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

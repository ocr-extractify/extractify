import axios, { type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '@/utils/constants';

export const httpClient = axios.create({
  // baseURL: '/api' // -> DOCKER URL
  baseURL: API_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponseData>) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.setItem('isAuthenticated', 'false');
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

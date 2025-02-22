import axios, { type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export const httpClient = axios.create({
  // baseURL: '/api' // -> DOCKER URL
  baseURL:
    process.env.NODE_ENV === 'development'
      ? import.meta.env.VITE_API_ENDPOINT_DEVELOPMENT
      : import.meta.env.VITE_API_ENDPOINT_PRODUCTION,
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
export const API_URL =
  process.env.NODE_ENV === 'development'
    ? import.meta.env.VITE_API_ENDPOINT_DEVELOPMENT
    : import.meta.env.VITE_API_ENDPOINT_PRODUCTION;

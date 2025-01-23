import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { FilesPage, FilePage, StatsPage, UploadFilesPage, Base, SignInPage, SignUpPage } from '@/pages';
import '@/main.css';
import './i18n';
import { AuthProvider } from './providers/AuthProvider';
import SettingsAppearancePage from './pages/settings/SettingsAppearancePage';
import { ThemeProvider } from './providers/theme-provider';
import { ToastProvider } from '@radix-ui/react-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  // public routes
  {
    path: "/auth/signin",
    element: <SignInPage />,
  },
  {
    path: "/auth/signup",
    element: <SignUpPage />,
  },
  // private routes
  {
    path: '/',
    element: <Base />,
    children: [
      {
        path: '/',
        element: <Navigate to="/upload" />,
      },
      {
        path: '/upload',
        element: <UploadFilesPage />,
      },
      {
        path: '/files',
        element: <FilesPage />,
      },
      {
        path: '/files/:id',
        element: <FilePage />,
      },
      {
        path: '/stats',
        element: <StatsPage />,
      },
      {
        path: "/settings/profile",
      },
      {
        path: "/settings/appearance",
        element: <SettingsAppearancePage />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider> 
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
              <ToastContainer />
            </QueryClientProvider>
        </AuthProvider> 
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

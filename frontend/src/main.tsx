import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import {
  FilesSetsPage,
  FilePage,
  UploadFilesPage,
  Base,
  SignInPage,
  SignUpPage,
  NotFoundPage,
  AppearancePage,
  UserLanguagePage,
  FilesSetPage,
} from '@/pages';
import '@/main.css';
import '@/i18n';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/theme-provider';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import ProcessedFilesPage from './pages/stats/ProcessedFiles';

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
    path: '/auth/signin',
    element: <SignInPage />,
  },
  {
    path: '/auth/signup',
    element: <SignUpPage />,
  },
  // private routes
  {
    path: '/',
    element: <Base />,
    children: [
      {
        path: '/',
        element: <Navigate to="/files/upload" />,
      },
      {
        path: '/files/upload',
        element: <UploadFilesPage />,
      },
      {
        path: '/files/sets',
        element: <FilesSetsPage />,
      },
      {
        path: '/files/sets/:id',
        element: <FilesSetPage />,
      },
      {
        path: '/settings/profile',
      },
      {
        path: '/settings/language',
        element: <UserLanguagePage />,
      },
      {
        path: '/settings/appearance',
        element: <AppearancePage />,
      },
      {
        path: '/stats/processed-files',
        element: <ProcessedFilesPage />,
      },
      // 404 fallback for private routes
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
  // 404 fallback for pubic routes
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
);

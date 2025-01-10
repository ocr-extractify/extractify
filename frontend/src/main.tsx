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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  // TODO: IN FUTURE, ITS NEEDED TO SETUP AN AUTH PROVIDER TO ACCESS THE MAIN PAGES
  {
    path: "/auth/signin",
    element: <SignInPage />,
  },
  {
    path: "/auth/signup",
    element: <SignUpPage />,
  },
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> 
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer />
      </QueryClientProvider>
    </AuthProvider> 
  </React.StrictMode>,
);

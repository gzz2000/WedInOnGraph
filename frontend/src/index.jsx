import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from './root';
import Login from './login';
import Home from './home';
import Network from './network';
import Explore from './explore';
import SearchUser from './search_user';
import { AuthProvider } from './context_auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/explore',
        element: <Explore />
      },
      {
        path: '/search_user',
        element: <SearchUser />
      },
      {
        path: '/network/:username',
        element: <Network />
      },
      {
        path: '/login',
        element: <Login />
      }
    ],
  }
])

createRoot(document.getElementById('container')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

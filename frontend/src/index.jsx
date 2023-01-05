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
        path: '/network',
        element: <Network />
      },
      {
        path: '/explore',
        element: <Explore />
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
    <RouterProvider router={router} />
  </React.StrictMode>
);


import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from './root';
import Login from './login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <div>hello homepage</div>
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

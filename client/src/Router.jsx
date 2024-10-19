import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Home from './Home';

const Root = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export const createRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "",
          element: <Home />
        }
      ]
    }
  ]);

  return router;
};

import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Home from './Home';
import Flights from './Flights';
import Hotels from './Hotels';

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
        },
        {
          path: "/flights",
          element: <Flights />
        },
        {
          path: "/hotels",
          element: <Hotels />
        },
      ]
    }
  ]);

  return router;
};

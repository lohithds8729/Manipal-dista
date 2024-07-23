import { useRoutes } from "react-router-dom";
import { protectedDashboardRoutes } from "./Admin/Dashboard/routes/routes";
import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { AppProvider } from "./Admin/AppProviders/providers/app";

const PrivateRoute = () => {
  const protectedRoutes = [...protectedDashboardRoutes];
  const route = protectedRoutes;
  const element = useRoutes([...route]);

  return (
    <AppProvider>
      <Router>
        <Routes>{element}</Routes>
      </Router>
    </AppProvider>
  );
};

export default PrivateRoute;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Login/Login";
import Dashboard from "./Admin/Dashboard";
import Layout from "./Layout/Layout";
import UserProfile from "./Login/UserProfile";
import { protectedDashboardRoutes } from "./Admin/Dashboard/routs";

function App() {
  const MainLayout = ({ children }) => {
    return (
      <Layout>
        <main id="main" className="main">
          {children}
        </main>
      </Layout>
    );
  };

  const UserProfileLayout = () => {
    return (
      <MainLayout>
        <UserProfile />
      </MainLayout>
    );
  };

  return (
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/user-profile" element={<UserProfileLayout />} />
          {/* <Route path="/" element={<Login />} /> */}
          <Route
            path="/"
            element={
                <Dashboard />
            }
          />
          <Route path="/user-profile" element={<UserProfileLayout />} />
          {protectedDashboardRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<MainLayout>{route.element}</MainLayout>}
            />
          ))}
        </Routes>
      </Router>
    // </AuthProvider>
  );
}

export default App;
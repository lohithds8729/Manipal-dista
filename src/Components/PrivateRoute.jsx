import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

export default function PrivateRoute({ children, allowedRoles }) {
  const { auth } = useAuth();

//console.log("auth",auth?.checkstatus);

    const token = localStorage.getItem('token');

    if(auth?.checkstatus === '1' || token === null) {
        if (!auth.isAuthenticated) {
           // console.log("isAuthenticated",auth?.isAuthenticated);
            return <Navigate to="/" />;
        }

        if (!allowedRoles.includes(auth.role)) {
            return <Navigate to="/" />;
        }
    }

    return children;
}
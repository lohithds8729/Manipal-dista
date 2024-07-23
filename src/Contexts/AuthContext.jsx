import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Fix import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ checkstatus: '0' });

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     const decodedToken = jwtDecode(token);
  //     setAuth({
  //       isAuthenticated: true,
  //       role: decodedToken.userId.Role === '1' ? 'Admin' : 'User',
  //       userDetails: decodedToken.userId,
  //       email: decodedToken.userId.Email,
  //       checkstatus: '1',
  //     });
  //   } else {
  //     setAuth({
  //       isAuthenticated: false,
  //       role: '',
  //       userDetails: '',
  //       email: '',
  //       checkstatus: '0',
  //     });
  //   }
  // }, []);

  const handleSetAuth = (newAuth) => {
    if (!newAuth.isAuthenticated) {
      // localStorage.removeItem('token');
    }
    setAuth(newAuth);
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth: handleSetAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
import React from 'react';
import Header from '../Login/Headers';
import Sidebar from '../Admin/Sidebar';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Sidebar />
      <div>{children}</div>
    </>
  );
};

export default Layout;
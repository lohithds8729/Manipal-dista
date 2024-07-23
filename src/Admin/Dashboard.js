import React from 'react';
import Header from '../Login/Headers';
import Sidebar from '../Admin/Sidebar';
import MainContent from './MainContent';
// import Footer from './Footer';

function Dashboard() {
  return (
    <div>
      <Header />
      <Sidebar />
      <MainContent /> 
      {/* <Footer /> */}
    </div>
  );
}

export default Dashboard;
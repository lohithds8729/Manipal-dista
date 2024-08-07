import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import axios from 'axios';
import relayService from "../Admin/AppProviders/Axios/hook";
import { jwtDecode } from 'jwt-decode';

function Header() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate()

  const [userName, setUserName] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const username = localStorage.getItem('UserName');
    try {
      const response = await relayService({
        url: `/auth/getUsers?UserName=${username}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        data: {},
      });
      if (response) {
        console.log(response, "response");
        setUserName(response.data.data[0]?.UserName);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = async () => {
    const user = localStorage.getItem('UserName');
    try {
      const response = await relayService({
        url: `/auth/logout`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: {
          UserName: user,
        },
      });
      if (response) {
        navigate(`/`);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const toggleSidebar = () => {
    document.body.classList.toggle('toggle-sidebar');
  };


  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <a href="/" className="logo d-flex align-items-center">
          <img src="./fitpeo.jpeg" alt="" />
          {/* {/ <span className="d-none d-lg-block">Adani Cement</span> /} */}
        </a>
        <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar} />
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <li className="nav-item d-flex">
            <a className="nav-link nav-icon search-bar-toggle " href="/">
              <i className="bi bi-search" />
            </a>
            <a className="nav-link nav-icon me-3" href="/">
            <i className="bi bi-bell" />
          </a>
          <a className="nav-link nav-icon me-3" href="/">
            <i className="bi bi-chat-dots" />
          </a>
          <a className="nav-link nav-icon me-3" href="/">
            <i className="bi bi-gear" />
          </a>
          </li>
          <li className="nav-item dropdown pe-3">
            <a
              className="nav-link nav-profile d-flex align-items-center pe-0"
              href="/"
              data-bs-toggle="dropdown"
            >
              <img
                src="./profileicon.jpg"
                alt="Profile"
                className="rounded-circle"
              />
              <span className="d-none d-md-block dropdown-toggle ps-2">
                {userName}
              </span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header">
                <h6>{userName}</h6>
                <span>{user === '1' ? 'Admin' : user === '2' ? 'Agent' : ''}</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center" onClick={handleLogout} style={{ cursor: "pointer" }} >
                  <i className="bi bi-box-arrow-right" />
                  <span>Sign Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

    </header>

  );
}

export default Header;
import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./Main.css";
import { Card, CardBody } from "react-bootstrap";
import relayService from "../Admin/AppProviders/Axios/hook";

const Sidebar = () => {
  const location = useLocation(); // Get the current location using useLocation hook
  const { tenantName } = useParams();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userTeam, setUserTeam] = useState('');

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
        setUserRole(response.data.data[0]?.Role);
        setUserLocation(response.data.data[0]?.Location);
        setUserTeam(response.data.data[0]?.Team);

      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <aside id="sidebar" className="sidebar" style={{ width: "300px" }}>
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === `/admin` ? "active" : ""}`}
            to={`/admin`}
          >
            <i className="bi bi-grid" />
            <span>Dashboard</span>
          </Link>
        </li>
        {/* End Dashboard Nav */}

        <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === `/cdrsfetched` ? "active" : ""}`}
            to="/cdrsfetched"
          // onClick={() => handleItemClick("cdrfetched")}
          >
            <i className="bi bi-telephone"></i>
            <span>CDR</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === `/crmsyncfailure` ? "active" : ""}`}
            to="/crmsyncfailure"
          // onClick={() => handleItemClick("crmsyncfailure")}
          >
            <i className="bi bi-exclamation-triangle-fill"></i> {/* Icon for Failure Record */}
            <span> API Sync Failure</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${location.pathname === `/syncsuccessrecord` ? "active" : ""}`}
            to="/syncsuccessrecord"
          // onClick={() => handleItemClick("syncsuccessrecord")}
          >
            <i className="bi bi-check-circle-fill"></i> {/* Icon for Success Record */}
            <span>API Sync Success</span>
          </Link>
        </li>

      </ul>
      <div className="row" style={{ width: "900px", marginTop: "50px" }}>
        <div className="col-xl-4">
          <div className="card">
            <div className="card-body profile-card pt-4 d-flex flex-column align-items-center">
              <img
                src="./profileicon.jpg"
                alt="Profile"
                className="rounded-circle"
              />
              <h2>{userName}</h2>
              <h3>{userRole}</h3>
              <p>Team : {userTeam}</p>
              <p>Loaction : {userLocation}</p>
              <div className="social-links mt-2 ">
                <a href="https://twitter.com/?lang=en" className="twitter">
                  <i className="bi bi-twitter" />
                </a>
                <a href="https://www.facebook.com/" className="facebook">
                  <i className="bi bi-facebook" />
                </a>
                <a href="https://www.instagram.com/" className="instagram">
                  <i className="bi bi-instagram" />
                </a>
                <a href="https://www.linkedin.com/in/atish-kumar0518/" className="linkedin">
                  <i className="bi bi-linkedin" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

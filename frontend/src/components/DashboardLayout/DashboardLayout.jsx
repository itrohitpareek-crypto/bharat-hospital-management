import React, { useState } from "react";
import { FaBars, FaBell, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import "./DashboardLayout.css";

const DashboardLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.getAttribute("data-theme") === "dark");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <header className="dashboard-topbar glass">
          <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}><FaBars /></button>
          <h2 className="topbar-title">{title}</h2>
          <div className="topbar-actions">
            <button className="topbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
              {dark ? <FaSun /> : <FaMoon />}
            </button>
            <button className="topbar-icon-btn" title="Notifications">
              <FaBell />
              <span className="topbar-dot"></span>
            </button>
            <div className="topbar-user" onClick={() => navigate(`/${user?.role}/profile`)}>
              <div className="topbar-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="topbar-user-info">
                <p>{user?.name}</p>
                <span>{user?.role}</span>
              </div>
            </div>
            <button className="topbar-icon-btn" onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </header>
        <main className="dashboard-content fade-in">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;

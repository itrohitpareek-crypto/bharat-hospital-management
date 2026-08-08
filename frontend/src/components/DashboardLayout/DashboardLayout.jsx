import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaBell, FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./DashboardLayout.css";

const DashboardLayout = ({ title, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(document.documentElement.getAttribute("data-theme") === "dark");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) fetchNotifications();
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead) {
        await api.put(`/notifications/${notif._id}/read`);
      }
    } catch (err) {
      console.error(err);
    }
    setNotifOpen(false);
    fetchNotifications();
    if (notif.link) navigate(notif.link);
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    try {
      await api.put("/notifications/read-all");
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

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
            <div className="notif-wrap" ref={notifRef}>
              <button className="topbar-icon-btn" title="Notifications" onClick={handleBellClick}>
                <FaBell />
                {unreadCount > 0 && <span className="topbar-dot"></span>}
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button className="notif-mark-all" onClick={handleMarkAllRead}>Mark all read</button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.length ? (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          className={`notif-item ${!n.isRead ? "notif-item-unread" : ""}`}
                          onClick={() => handleNotificationClick(n)}
                        >
                          <p className="notif-title">{n.title}</p>
                          <p className="notif-message">{n.message}</p>
                          <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                      ))
                    ) : (
                      <p className="notif-empty">No notifications yet</p>
                    )}
                  </div>
                </div>
              )}
            </div>
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
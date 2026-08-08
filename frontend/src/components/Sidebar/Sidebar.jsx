import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHeartbeat, FaTachometerAlt, FaUserMd, FaUserInjured, FaCalendarCheck,
  FaFileInvoiceDollar, FaPills, FaFlask, FaCog, FaUserCircle, FaTimes
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const menuByRole = {
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/admin/doctors", label: "Doctors", icon: <FaUserMd /> },
    { to: "/admin/patients", label: "Patients", icon: <FaUserInjured /> },
    { to: "/admin/appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { to: "/admin/billing", label: "Billing", icon: <FaFileInvoiceDollar /> },
    { to: "/admin/pharmacy", label: "Pharmacy", icon: <FaPills /> },
    { to: "/admin/laboratory", label: "Laboratory", icon: <FaFlask /> },
    { to: "/admin/settings", label: "Settings", icon: <FaCog /> },
    { to: "/admin/profile", label: "Profile", icon: <FaUserCircle /> },
  ],
  doctor: [
    { to: "/doctor/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/doctor/appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { to: "/doctor/patients", label: "My Patients", icon: <FaUserInjured /> },
    { to: "/doctor/profile", label: "Profile", icon: <FaUserCircle /> },
  ],
  patient: [
    { to: "/patient/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/patient/appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { to: "/patient/billing", label: "Billing", icon: <FaFileInvoiceDollar /> },
    { to: "/patient/profile", label: "Profile", icon: <FaUserCircle /> },
  ],
};

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const menu = menuByRole[user?.role] || [];

  return (
    <>
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <span className="brand-icon"><img src="/images/logo.jpeg"></img></span>
          <span>Bharat <b>Hospital</b></span>
          <button className="sidebar-close" onClick={onClose}><FaTimes /></button>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Role</p>
          <span className="badge badge-info" style={{ textTransform: "capitalize" }}>{user?.role}</span>
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat, FaBars, FaTimes, FaMoon, FaSun } from "react-icons/fa";
import "./Navbar.css";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Departments", href: "#departments" },
  { label: "Doctors", href: "#doctors" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(document.documentElement.getAttribute("data-theme") === "dark");
  const navigate = useNavigate();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon"><img src="/images/logo.jpeg"></img></span>
          <span>Bharat <b>Hospital</b></span>
        </Link>

        <ul className={`navbar-links ${open ? "navbar-links-open" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
            </li>
          ))}
          <li className="navbar-mobile-actions">
            <button className="btn btn-outline btn-sm btn-block" onClick={() => navigate("/login")}>Login</button>
            <button className="btn btn-primary btn-sm btn-block" onClick={() => navigate("/register")}>Register</button>
          </li>
        </ul>

        <div className="navbar-actions">
          <button className="navbar-theme-btn" onClick={toggleTheme} title="Toggle dark/light mode">
            {dark ? <FaSun /> : <FaMoon />}
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate("/login")}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/register")}>Get Started</button>
        </div>

        <button className="navbar-theme-btn navbar-theme-btn-mobile" onClick={toggleTheme} title="Toggle dark/light mode">
          {dark ? <FaSun /> : <FaMoon />}
        </button>

        <button className="navbar-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
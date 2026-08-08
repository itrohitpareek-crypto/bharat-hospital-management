import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import GoogleSignInButton from "../../components/GoogleAuth/GoogleSignInButton";
import "./Auth.css";

const roles = [
  { key: "patient", label: "Patient" },
  { key: "doctor", label: "Doctor" },
  { key: "admin", label: "Admin" },
];

const Login = () => {
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleSuccess = async (idToken) => {
    try {
      const user = await loginWithGoogle(idToken);
      toast.success(`Welcome, ${user.name}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password, role);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="brand-icon"><img src="/images/logo.jpeg"></img> </span>
          <h2>Bharat Hospital</h2>
          <p>Access your dashboard to manage appointments, records and care — all in one secure place.</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form-card fade-in">
          <Link to="/" className="auth-back">&larr; Back to home</Link>
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Login to continue to your dashboard</p>

          <div className="role-tabs">
            {roles.map((r) => (
              <button
                key={r.key}
                type="button"
                className={`role-tab ${role === r.key ? "role-tab-active" : ""}`}
                onClick={() => setRole(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrap">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">Forgot password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider"><span>OR</span></div>

          <div className="google-btn-center">
            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={(msg) => toast.error(msg)} />
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>

         
        </div>
      </div>
    </div>
  );
};

export default Login;
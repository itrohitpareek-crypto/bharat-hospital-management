import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeartbeat, FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import GoogleSignInButton from "../../components/GoogleAuth/GoogleSignInButton";
import "../Login/Auth.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleSuccess = async (idToken) => {
    try {
      const user = await loginWithGoogle(idToken);
      toast.success(`Welcome to Bharat Hospital, ${user.name}!`);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "patient",
      });
      toast.success(`Welcome to Bharat Hospital, ${user.name}!`);
      navigate("/patient/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="brand-icon"><img src="https://bharathospitalsrdr.com/wp-content/uploads/2025/01/2ed8f6f3-0c13-4d62-90c4-027227a9792f-removebg-preview.png"></img></span>
          <h2>Join Bharat Hospital</h2>
          <p>Create your patient account to book appointments, track records and manage your care journey.</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form-card fade-in">
          <Link to="/" className="auth-back">&larr; Back to home</Link>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Register as a patient to get started</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrap">
                <FaUser className="input-icon" />
                <input type="text" name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required style={{ paddingLeft: 44 }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrap">
                <FaEnvelope className="input-icon" />
                <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required style={{ paddingLeft: 44 }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-icon-wrap">
                <FaPhone className="input-icon" />
                <input type="tel" name="phone" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} style={{ paddingLeft: 44 }} />
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
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                />
                <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrap">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-divider"><span>OR</span></div>

          <div className="google-btn-center">
            <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={(msg) => toast.error(msg)} />
          </div>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

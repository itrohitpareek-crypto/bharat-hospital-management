import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeartbeat, FaEnvelope, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../services/api";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="brand-icon"><FaHeartbeat /></span>
          <h2>Bharat Hospital</h2>
          <p>Access your dashboard to manage appointments, records and care — all in one secure place.</p>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form-card fade-in">
          <Link to="/login" className="auth-back">&larr; Back to login</Link>

          {sent ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <FaCheckCircle style={{ fontSize: 48, color: "var(--success)", marginBottom: 16 }} />
              <h1 style={{ fontSize: 22 }}>Check Your Email</h1>
              <p className="auth-subtitle" style={{ marginBottom: 0 }}>
                If an account exists with <strong>{email}</strong>, we've sent a password reset link.
                It will expire in 30 minutes — don't forget to check your spam folder.
              </p>
            </div>
          ) : (
            <>
              <h1>Forgot Password?</h1>
              <p className="auth-subtitle">Enter your email and we'll send you a link to reset your password</p>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-icon-wrap">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ paddingLeft: 44 }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="auth-switch">
                Remembered your password? <Link to="/login">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import React, { useState, useRef } from "react";
import { FaCamera, FaSave, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import "./Profile.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "", address: user?.address || "",
    gender: user?.gender || "", dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
  });
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPwd, setChangingPwd] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append("profileImage", file);

      const { data } = await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setChangingPwd(true);
    try {
      await api.put("/auth/change-password", passwords);
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <DashboardLayout title="Profile">
      <PageHeader title="My Profile" subtitle="Manage your personal information and account settings" />

      <div className="profile-grid">
        <div className="card profile-card">
          <form onSubmit={handleSave}>
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">
                {preview ? <img src={preview} alt={user?.name} /> : user?.name?.charAt(0).toUpperCase()}
              </div>
              <button type="button" className="avatar-edit-btn" onClick={() => fileRef.current.click()}>
                <FaCamera />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" value={user?.email} disabled />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-control" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" className="form-control" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}><FaSave /> {saving ? "Saving..." : "Save Changes"}</button>
          </form>
        </div>

        <div className="card profile-card">
          <h3 style={{ marginBottom: 20 }}><FaLock style={{ marginRight: 8, color: "var(--primary)" }} />Change Password</h3>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-control" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-outline btn-block" disabled={changingPwd}>
              {changingPwd ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

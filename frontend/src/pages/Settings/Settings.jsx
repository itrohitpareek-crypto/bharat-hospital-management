import React, { useEffect, useState, useRef } from "react";
import { FaSave, FaImage } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";

const Settings = () => {
  const [form, setForm] = useState({ hospitalName: "", email: "", phone: "", address: "" });
  const [logoPreview, setLogoPreview] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        setForm({
          hospitalName: data.settings.hospitalName || "",
          email: data.settings.email || "",
          phone: data.settings.phone || "",
          address: data.settings.address || "",
        });
        setLogoPreview(data.settings.logo || "");
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setLogoPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append("logo", file);

      await api.put("/settings", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Hospital settings updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings">
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <PageHeader title="Hospital Settings" subtitle="Manage your hospital's general information and branding" />

      <div className="card" style={{ padding: 28, maxWidth: 640 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 16, background: "var(--primary-50)",
              display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
            }}>
              {logoPreview ? <img src={logoPreview} alt="Hospital Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FaImage style={{ fontSize: 28, color: "var(--primary)" }} />}
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()}>Upload Logo</button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Hospital Name</label>
            <input className="form-control" value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea className="form-control" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}><FaSave /> {saving ? "Saving..." : "Save Settings"}</button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;

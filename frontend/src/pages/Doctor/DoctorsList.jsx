import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaUserMd } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import SearchBar from "../../components/Search/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modals/Modal";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";

const emptyForm = {
  name: "", email: "", password: "", phone: "", specialization: "", department: "",
  qualification: "", experience: "", fee: "", availableDays: [], availableTimeStart: "09:00", availableTimeEnd: "17:00",
};

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/doctors", { params: { search, page, limit: 8 } });
      setDoctors(data.doctors);
      setPages(data.pages);
    } catch (err) {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, [search, page]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (doc) => {
    setEditing(doc);
    setForm({
      name: doc.user?.name || "", email: doc.user?.email || "", password: "",
      phone: doc.user?.phone || "", specialization: doc.specialization, department: doc.department,
      qualification: doc.qualification, experience: doc.experience, fee: doc.fee,
      availableDays: doc.availableDays || [],
      availableTimeStart: doc.availableTimeStart || "09:00",
      availableTimeEnd: doc.availableTimeEnd || "17:00",
    });
    setModalOpen(true);
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/doctors/${editing._id}`, form);
        toast.success("Doctor updated successfully");
      } else {
        await api.post("/doctors", form);
        toast.success("Doctor added successfully");
      }
      setModalOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this doctor?")) return;
    try {
      await api.delete(`/doctors/${id}`);
      toast.success("Doctor removed");
      fetchDoctors();
    } catch (err) {
      toast.error("Failed to delete doctor");
    }
  };

  return (
    <DashboardLayout title="Doctors">
      <PageHeader
        title="Manage Doctors"
        subtitle="Add, edit or remove doctors from your hospital"
        action={<button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Doctor</button>}
      />

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name, specialization..." />
      </div>

      <div className="card" style={{ padding: 20 }}>
        {loading ? <Loader /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Doctor</th><th>Specialization</th><th>Department</th><th>Duty Schedule</th><th>Fee</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {doctors.length ? doctors.map((d) => (
                  <tr key={d._id}>
                    <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--primary-50)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaUserMd />
                      </div>
                      {d.user?.name}
                    </td>
                    <td>{d.specialization}</td>
                    <td>{d.department}</td>
                    <td style={{ fontSize: 12.5 }}>
                      {d.availableDays?.length ? d.availableDays.map((day) => day.slice(0, 3)).join(", ") : "Every day"}
                      <br />
                      <span style={{ color: "var(--text-secondary)" }}>{d.availableTimeStart || "09:00"} – {d.availableTimeEnd || "17:00"}</span>
                    </td>
                    <td>₹{d.fee}</td>
                    <td><span className={`badge badge-${d.status === "active" ? "success" : "muted"}`}>{d.status}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(d)} style={{ marginRight: 8 }}><FaEdit /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}><FaTrash /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)" }}>No doctors found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Doctor" : "Add New Doctor"} width={600}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={!!editing} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={!!editing} />
            </div>
          </div>
          {!editing && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input className="form-control" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-control" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Qualification</label>
              <input className="form-control" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience (yrs)</label>
              <input type="number" className="form-control" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Fee (₹)</label>
              <input type="number" className="form-control" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Duty Days (patients can only book on these days)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {weekDays.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={form.availableDays.includes(day) ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                  style={{ padding: "6px 14px", fontSize: 12.5 }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
            {form.availableDays.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                No days selected — doctor will be treated as available every day.
              </p>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Duty Start Time</label>
              <input type="time" className="form-control" value={form.availableTimeStart} onChange={(e) => setForm({ ...form, availableTimeStart: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Duty End Time</label>
              <input type="time" className="form-control" value={form.availableTimeEnd} onChange={(e) => setForm({ ...form, availableTimeEnd: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Saving..." : editing ? "Update Doctor" : "Add Doctor"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default DoctorsList;
import React, { useEffect, useState } from "react";
import { FaPlus, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import Modal from "../../components/Modals/Modal";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ doctor: "", date: "", time: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/appointments");
      setAppointments(data.appointments);
    } catch (err) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get("/doctors", { params: { limit: 100 } });
      setDoctors(data.doctors);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    if (user?.role === "patient") fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!form.doctor || !form.date) {
        setSlots([]);
        setSlotsMessage("");
        return;
      }
      setSlotsLoading(true);
      setSlotsMessage("");
      try {
        const { data } = await api.get(`/doctors/${form.doctor}/slots`, { params: { date: form.date } });
        if (!data.available) {
          setSlots([]);
          setSlotsMessage(`This doctor is not available on ${data.day}s. Please choose a different date.`);
        } else if (data.slots.length === 0) {
          setSlots([]);
          setSlotsMessage("No time slots left for this date — all slots are booked. Please choose a different date.");
        } else {
          setSlots(data.slots);
        }
      } catch (err) {
        setSlots([]);
        setSlotsMessage("Could not load available slots. Please try again.");
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
    setForm((prev) => ({ ...prev, time: "" }));
  }, [form.doctor, form.date]);

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/appointments", form);
      toast.success("Appointment booked successfully");
      setModalOpen(false);
      setForm({ doctor: "", date: "", time: "", reason: "" });
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to update appointment");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to cancel appointment");
    }
  };

  const statusColor = (s) => ({
    approved: "success", pending: "warning", rejected: "danger",
    cancelled: "danger", completed: "info",
  }[s] || "muted");

  return (
    <DashboardLayout title="Appointments">
      <PageHeader
        title="Appointments"
        subtitle={user?.role === "patient" ? "Book and track your appointments" : "Manage patient appointment requests"}
        action={user?.role === "patient" && (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><FaPlus /> Book Appointment</button>
        )}
      />

      <div className="card" style={{ padding: 20 }}>
        {loading ? <Loader /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {user?.role !== "patient" && <th>Patient</th>}
                  {user?.role !== "doctor" && <th>Doctor</th>}
                  <th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length ? appointments.map((a) => (
                  <tr key={a._id}>
                    {user?.role !== "patient" && <td>{a.patient?.user?.name || "—"}</td>}
                    {user?.role !== "doctor" && <td>{a.doctor?.user?.name || "—"}</td>}
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.time}</td>
                    <td>{a.reason || "—"}</td>
                    <td><span className={`badge badge-${statusColor(a.status)}`}>{a.status}</span></td>
                    <td>
                      {(user?.role === "doctor" || user?.role === "admin") && a.status === "pending" && (
                        <>
                          <button className="btn btn-ghost btn-sm" style={{ marginRight: 6, color: "var(--success)" }} onClick={() => updateStatus(a._id, "approved")}><FaCheck /></button>
                          <button className="btn btn-ghost btn-sm" style={{ marginRight: 6, color: "var(--danger)" }} onClick={() => updateStatus(a._id, "rejected")}><FaTimes /></button>
                        </>
                      )}
                      {(user?.role === "doctor" || user?.role === "admin") && a.status === "approved" && (
                        <button className="btn btn-ghost btn-sm" style={{ marginRight: 6 }} onClick={() => updateStatus(a._id, "completed")}>Mark Complete</button>
                      )}
                      {user?.role === "patient" && ["pending", "approved"].includes(a.status) && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a._id)}><FaTrash /></button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)" }}>No appointments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Book New Appointment">
        <form onSubmit={handleBook}>
          <div className="form-group">
            <label className="form-label">Select Doctor</label>
            <select className="form-control" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} required>
              <option value="">Choose a doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>{d.user?.name} — {d.specialization} (₹{d.fee})</option>
              ))}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Available Time Slots</label>
              <select
                className="form-control"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                disabled={!form.doctor || !form.date || slotsLoading || slots.length === 0}
              >
                <option value="">
                  {slotsLoading ? "Loading slots..." : !form.doctor || !form.date ? "Select doctor & date first" : slots.length === 0 ? "No slots available" : "Choose a time"}
                </option>
                {slots.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {slotsMessage && (
                <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 6 }}>{slotsMessage}</p>
              )}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Reason for Visit</label>
            <textarea className="form-control" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Briefly describe your symptoms or reason for visit" />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Appointments;
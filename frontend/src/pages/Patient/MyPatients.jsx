import React, { useEffect, useState } from "react";
import { FaUserInjured, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import Modal from "../../components/Modals/Modal";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

// Doctor's view of patients they've had appointments with
const MyPatients = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get("/appointments");
        setAppointments(data.appointments);
      } catch (err) {
        toast.error("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const uniquePatients = Array.from(
    new Map(appointments.map((a) => [a.patient?._id, a.patient])).values()
  ).filter(Boolean);

  const openNotes = (appointment) => {
    setSelected(appointment);
    setPrescription(appointment.prescription || "");
    setNotes(appointment.notes || "");
    setModalOpen(true);
  };

  const saveNotes = async () => {
    try {
      await api.put(`/appointments/${selected._id}`, { prescription, notes });
      toast.success("Notes saved successfully");
      setModalOpen(false);
      const { data } = await api.get("/appointments");
      setAppointments(data.appointments);
    } catch (err) {
      toast.error("Failed to save notes");
    }
  };

  return (
    <DashboardLayout title="My Patients">
      <PageHeader title="My Patients" subtitle="Patients you have consulted with" />

      <div className="card" style={{ padding: 20 }}>
        {loading ? <Loader /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Patient</th><th>Latest Visit</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appointments.length ? appointments.map((a) => (
                  <tr key={a._id}>
                    <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--primary-50)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaUserInjured />
                      </div>
                      {a.patient?.user?.name}
                    </td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.reason || "—"}</td>
                    <td><span className="badge badge-info">{a.status}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openNotes(a)}><FaEye /> Notes & Prescription</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>No patients yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Consultation — ${selected?.patient?.user?.name || ""}`}>
        <div className="form-group">
          <label className="form-label">Medical Notes</label>
          <textarea className="form-control" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Diagnosis, observations..." />
        </div>
        <div className="form-group">
          <label className="form-label">Prescription</label>
          <textarea className="form-control" rows={4} value={prescription} onChange={(e) => setPrescription(e.target.value)} placeholder="Medicines, dosage, instructions..." />
        </div>
        <button className="btn btn-primary btn-block" onClick={saveNotes}>Save</button>
      </Modal>
    </DashboardLayout>
  );
};

export default MyPatients;

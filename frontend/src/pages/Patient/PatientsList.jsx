import React, { useEffect, useState } from "react";
import { FaTrash, FaEye, FaUserInjured } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import SearchBar from "../../components/Search/SearchBar";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modals/Modal";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/patients", { params: { search, page, limit: 8 } });
      setPatients(data.patients);
      setPages(data.pages);
    } catch (err) {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, [search, page]);

  const viewPatient = async (patient) => {
    setSelected(patient);
    setModalOpen(true);
    try {
      const { data } = await api.get(`/patients/${patient._id}/summary`);
      setSummary(data);
    } catch (err) {
      toast.error("Failed to load patient summary");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this patient?")) return;
    try {
      await api.delete(`/patients/${id}`);
      toast.success("Patient removed");
      fetchPatients();
    } catch (err) {
      toast.error("Failed to delete patient");
    }
  };

  return (
    <DashboardLayout title="Patients">
      <PageHeader title="Manage Patients" subtitle="View patient profiles, history and records" />

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or email..." />
      </div>

      <div className="card" style={{ padding: 20 }}>
        {loading ? <Loader /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Patient</th><th>Email</th><th>Phone</th><th>Blood Group</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {patients.length ? patients.map((p) => (
                  <tr key={p._id}>
                    <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--primary-50)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaUserInjured />
                      </div>
                      {p.user?.name}
                    </td>
                    <td>{p.user?.email}</td>
                    <td>{p.user?.phone || "—"}</td>
                    <td>{p.bloodGroup || "—"}</td>
                    <td><span className={`badge badge-${p.user?.isActive ? "success" : "muted"}`}>{p.user?.isActive ? "Active" : "Inactive"}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => viewPatient(p)} style={{ marginRight: 8 }}><FaEye /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}><FaTrash /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)" }}>No patients found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} onChange={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selected?.user?.name || "Patient Details"} width={640}>
        {!summary ? <Loader /> : (
          <div>
            <h4 style={{ marginBottom: 12 }}>Recent Appointments</h4>
            <div className="table-wrap" style={{ marginBottom: 24 }}>
              <table>
                <thead><tr><th>Doctor</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {summary.appointments?.length ? summary.appointments.slice(0, 5).map((a) => (
                    <tr key={a._id}>
                      <td>{a.doctor?.user?.name || "—"}</td>
                      <td>{new Date(a.date).toLocaleDateString()}</td>
                      <td><span className="badge badge-info">{a.status}</span></td>
                    </tr>
                  )) : <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)" }}>No appointments</td></tr>}
                </tbody>
              </table>
            </div>
            <h4 style={{ marginBottom: 12 }}>Recent Bills</h4>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Invoice</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {summary.bills?.length ? summary.bills.slice(0, 5).map((b) => (
                    <tr key={b._id}>
                      <td>{b.invoiceNumber}</td>
                      <td>₹{b.grandTotal?.toLocaleString()}</td>
                      <td><span className={`badge badge-${b.status === "paid" ? "success" : "warning"}`}>{b.status}</span></td>
                    </tr>
                  )) : <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)" }}>No bills</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default PatientsList;

import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaFlask } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import Modal from "../../components/Modals/Modal";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const testTypes = ["Blood Test", "Urine Test", "MRI", "CT Scan", "X-Ray", "Other"];

const emptyForm = { patient: "", testType: "Blood Test", testName: "", price: "", scheduledDate: "" };

const Laboratory = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [resultModal, setResultModal] = useState(null);
  const [resultText, setResultText] = useState("");

  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/lab");
      setTests(data.tests);
    } catch (err) {
      toast.error("Failed to load lab tests");
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await api.get("/patients", { params: { limit: 200 } });
      setPatients(data.patients);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTests();
    if (user?.role !== "patient") fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/lab", form);
      toast.success("Lab test requested successfully");
      setModalOpen(false);
      setForm(emptyForm);
      fetchTests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request test");
    } finally {
      setSubmitting(false);
    }
  };

  const saveResult = async () => {
    try {
      await api.put(`/lab/${resultModal._id}`, { result: resultText, status: "completed" });
      toast.success("Result saved");
      setResultModal(null);
      setResultText("");
      fetchTests();
    } catch (err) {
      toast.error("Failed to save result");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab test record?")) return;
    try {
      await api.delete(`/lab/${id}`);
      toast.success("Test removed");
      fetchTests();
    } catch (err) {
      toast.error("Failed to delete test");
    }
  };

  const statusColor = (s) => ({ completed: "success", "in-progress": "info", pending: "warning" }[s] || "muted");

  return (
    <DashboardLayout title="Laboratory">
      <PageHeader
        title="Laboratory Tests"
        subtitle={user?.role === "patient" ? "View your lab test reports" : "Manage lab test requests and results"}
        action={user?.role !== "patient" && (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><FaPlus /> New Test Request</button>
        )}
      />

      <div className="card" style={{ padding: 20 }}>
        {loading ? <Loader /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {user?.role !== "patient" && <th>Patient</th>}
                  <th>Test Type</th><th>Test Name</th><th>Status</th><th>Result</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.length ? tests.map((t) => (
                  <tr key={t._id}>
                    {user?.role !== "patient" && <td>{t.patient?.user?.name || "—"}</td>}
                    <td><FaFlask style={{ marginRight: 6, color: "var(--primary)" }} />{t.testType}</td>
                    <td>{t.testName}</td>
                    <td><span className={`badge badge-${statusColor(t.status)}`}>{t.status}</span></td>
                    <td>{t.result ? t.result.slice(0, 40) + (t.result.length > 40 ? "..." : "") : "—"}</td>
                    <td>
                      {user?.role !== "patient" && t.status !== "completed" && (
                        <button className="btn btn-ghost btn-sm" style={{ marginRight: 6 }} onClick={() => { setResultModal(t); setResultText(t.result || ""); }}>Add Result</button>
                      )}
                      {user?.role !== "patient" && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}><FaTrash /></button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)" }}>No lab tests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Request Lab Test">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Patient</label>
            <select className="form-control" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.user?.name}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Test Type</label>
              <select className="form-control" value={form.testType} onChange={(e) => setForm({ ...form, testType: e.target.value })}>
                {testTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Test Name / Details</label>
            <input className="form-control" value={form.testName} onChange={(e) => setForm({ ...form, testName: e.target.value })} required placeholder="e.g. Complete Blood Count (CBC)" />
          </div>
          <div className="form-group">
            <label className="form-label">Scheduled Date</label>
            <input type="date" className="form-control" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Submitting..." : "Request Test"}
          </button>
        </form>
      </Modal>

      <Modal open={!!resultModal} onClose={() => setResultModal(null)} title="Add Test Result">
        <div className="form-group">
          <label className="form-label">Result Details</label>
          <textarea className="form-control" rows={6} value={resultText} onChange={(e) => setResultText(e.target.value)} placeholder="Enter test findings and observations..." />
        </div>
        <button className="btn btn-primary btn-block" onClick={saveResult}>Save Result</button>
      </Modal>
    </DashboardLayout>
  );
};

export default Laboratory;

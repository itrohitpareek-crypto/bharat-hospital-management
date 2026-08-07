import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import SearchBar from "../../components/Search/SearchBar";
import Modal from "../../components/Modals/Modal";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";

const emptyForm = { name: "", category: "", manufacturer: "", price: "", stock: "", unit: "tablet", expiryDate: "", batchNumber: "", reorderLevel: 10 };

const Pharmacy = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/medicines", { params: { search, limit: 50 } });
      setMedicines(data.medicines);
    } catch (err) {
      toast.error("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, [search]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ ...m, expiryDate: m.expiryDate ? m.expiryDate.split("T")[0] : "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/medicines/${editing._id}`, form);
        toast.success("Medicine updated");
      } else {
        await api.post("/medicines", form);
        toast.success("Medicine added to inventory");
      }
      setModalOpen(false);
      fetchMedicines();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this medicine from inventory?")) return;
    try {
      await api.delete(`/medicines/${id}`);
      toast.success("Medicine removed");
      fetchMedicines();
    } catch (err) {
      toast.error("Failed to delete medicine");
    }
  };

  return (
    <DashboardLayout title="Pharmacy">
      <PageHeader
        title="Pharmacy & Stock Management"
        subtitle="Track medicine inventory, pricing and expiry alerts"
        action={<button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Medicine</button>}
      />

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search medicines..." />
      </div>

      <div className="card" style={{ padding: 20 }}>
        {loading ? <Loader /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Medicine</th><th>Category</th><th>Price</th><th>Stock</th><th>Expiry</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {medicines.length ? medicines.map((m) => (
                  <tr key={m._id}>
                    <td>{m.name}</td>
                    <td>{m.category}</td>
                    <td>₹{m.price}</td>
                    <td>
                      {m.stock}
                      {m.stock <= m.reorderLevel && (
                        <span className="badge badge-danger" style={{ marginLeft: 8 }}><FaExclamationTriangle /> Low</span>
                      )}
                    </td>
                    <td>{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : "—"}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)} style={{ marginRight: 8 }}><FaEdit /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m._id)}><FaTrash /></button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--text-muted)" }}>No medicines found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Medicine" : "Add Medicine"} width={600}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Medicine Name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input type="number" className="form-control" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input type="date" className="form-control" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Reorder Level</label>
              <input type="number" className="form-control" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Saving..." : editing ? "Update Medicine" : "Add Medicine"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Pharmacy;

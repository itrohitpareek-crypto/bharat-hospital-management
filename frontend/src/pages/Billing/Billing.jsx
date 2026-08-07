import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import PageHeader from "../../components/PageHeader/PageHeader";
import Modal from "../../components/Modals/Modal";
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const emptyItem = { description: "", quantity: 1, unitPrice: 0 };

const Billing = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ patient: "", discount: 0, gstPercent: 5, items: [{ ...emptyItem }] });
  const [submitting, setSubmitting] = useState(false);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bills");
      setBills(data.bills);
    } catch (err) {
      toast.error("Failed to load bills");
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
    fetchBills();
    if (user?.role === "admin") fetchPatients();
  }, []);

  const updateItem = (idx, field, value) => {
    const items = [...form.items];
    items[idx][field] = field === "quantity" || field === "unitPrice" ? Number(value) : value;
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { ...emptyItem }] });
  const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });

  const subTotal = form.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const gstAmount = ((subTotal - form.discount) * form.gstPercent) / 100;
  const grandTotal = subTotal - form.discount + gstAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/bills", form);
      toast.success("Invoice created successfully");
      setModalOpen(false);
      setForm({ patient: "", discount: 0, gstPercent: 5, items: [{ ...emptyItem }] });
      fetchBills();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await api.put(`/bills/${id}`, { status: "paid", paymentMethod: "cash" });
      toast.success("Bill marked as paid");
      fetchBills();
    } catch (err) {
      toast.error("Failed to update bill");
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    try {
      await api.delete(`/bills/${id}`);
      toast.success("Invoice deleted");
      fetchBills();
    } catch (err) {
      toast.error("Failed to delete invoice");
    }
  };

  const [payingBillId, setPayingBillId] = useState(null);

  const handlePayNow = async (bill) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load. Please refresh and try again.");
      return;
    }

    setPayingBillId(bill._id);
    try {
      const { data } = await api.post("/payments/create-order", { billId: bill._id });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Bharat Hospital",
        description: `Invoice ${data.invoiceNumber}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              billId: bill._id,
            });
            toast.success("Payment successful! Your bill has been marked as paid.");
            fetchBills();
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed. Please contact the hospital.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2563eb" },
        modal: {
          ondismiss: () => setPayingBillId(null),
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start payment. Please try again.");
    } finally {
      setPayingBillId(null);
    }
  };

  return (
    <DashboardLayout title="Billing">
      <PageHeader
        title="Billing & Invoices"
        subtitle={user?.role === "admin" ? "Generate and manage patient invoices" : "View your bills and payment history"}
        action={user?.role === "admin" && (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}><FaPlus /> New Invoice</button>
        )}
      />

      <div className="card" style={{ padding: 20 }}>
        {loading ? <Loader /> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Invoice #</th>{user?.role === "admin" && <th>Patient</th>}<th>Sub Total</th><th>GST</th><th>Discount</th><th>Grand Total</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {bills.length ? bills.map((b) => (
                  <tr key={b._id}>
                    <td>{b.invoiceNumber}</td>
                    {user?.role === "admin" && <td>{b.patient?.user?.name || "—"}</td>}
                    <td>₹{b.subTotal?.toLocaleString()}</td>
                    <td>₹{b.gst?.toFixed(0)}</td>
                    <td>₹{b.discount}</td>
                    <td><strong>₹{b.grandTotal?.toLocaleString()}</strong></td>
                    <td><span className={`badge badge-${b.status === "paid" ? "success" : "warning"}`}>{b.status}</span></td>
                    <td>
                      {user?.role === "admin" && (
                        <>
                          {b.status !== "paid" && (
                            <button className="btn btn-ghost btn-sm" style={{ marginRight: 6, color: "var(--success)" }} onClick={() => markPaid(b._id)}><FaCheckCircle /></button>
                          )}
                          <button className="btn btn-danger btn-sm" onClick={() => deleteBill(b._id)}><FaTrash /></button>
                        </>
                      )}
                      {user?.role === "patient" && (
                        b.status === "paid" ? (
                          <span className="badge badge-success"><FaCheckCircle /> Paid{b.paymentMethod ? ` via ${b.paymentMethod}` : ""}</span>
                        ) : (
                          <button className="btn btn-primary btn-sm" onClick={() => handlePayNow(b)} disabled={payingBillId === b._id}>
                            <FaCreditCard /> {payingBillId === b._id ? "Starting..." : "Pay Now"}
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={user?.role === "admin" ? 8 : 7} style={{ textAlign: "center", color: "var(--text-muted)" }}>No invoices found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Invoice" width={640}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Patient</label>
            <select className="form-control" value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })} required>
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p._id} value={p._id}>{p.user?.name}</option>)}
            </select>
          </div>

          <label className="form-label">Invoice Items</label>
          {form.items.map((item, idx) => (
            <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 10, marginBottom: 10 }}>
              <input className="form-control" placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} required />
              <input type="number" className="form-control" placeholder="Qty" min="1" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} required />
              <input type="number" className="form-control" placeholder="Price" min="0" value={item.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", e.target.value)} required />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItem(idx)} disabled={form.items.length === 1}><FaTrash /></button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" onClick={addItem} style={{ marginBottom: 20 }}><FaPlus /> Add Item</button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Discount (₹)</label>
              <input type="number" className="form-control" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">GST (%)</label>
              <input type="number" className="form-control" value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: Number(e.target.value) })} />
            </div>
          </div>

          <div className="card" style={{ padding: 16, marginBottom: 20, background: "var(--primary-50)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Sub Total</span><strong>₹{subTotal.toLocaleString()}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>GST</span><strong>₹{gstAmount.toFixed(0)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17 }}><span>Grand Total</span><strong style={{ color: "var(--primary)" }}>₹{grandTotal.toLocaleString()}</strong></div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creating..." : "Generate Invoice"}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default Billing;
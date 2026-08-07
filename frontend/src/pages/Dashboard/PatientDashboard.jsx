import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaFileInvoiceDollar, FaReceipt, FaPlus } from "react-icons/fa";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import StatCard from "../../components/Cards/StatCard";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";
import "./Dashboard.css";

const PatientDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/patient");
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="My Dashboard">
        <Loader />
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};

  return (
    <DashboardLayout title="My Dashboard">
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <StatCard icon={<FaCalendarCheck />} label="Total Appointments" value={stats.totalAppointments} color="primary" />
        <StatCard icon={<FaFileInvoiceDollar />} label="Pending Amount" value={`₹${(stats.pendingBillsAmount || 0).toLocaleString()}`} color="danger" />
        <StatCard icon={<FaReceipt />} label="Total Bills" value={stats.totalBills} color="info" />
      </div>

      <div className="card recent-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Upcoming Appointments</h3>
          <button className="btn btn-primary btn-sm" onClick={() => navigate("/patient/appointments")}>
            <FaPlus /> Book Appointment
          </button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data?.upcomingAppointments?.length ? data.upcomingAppointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.doctor?.user?.name || "—"}</td>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.time}</td>
                  <td><span className={`badge badge-${a.status === "approved" ? "success" : "warning"}`}>{a.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>No upcoming appointments. Book one now!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;

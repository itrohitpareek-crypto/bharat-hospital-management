import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import {
  FaUserMd, FaUserInjured, FaCalendarCheck, FaRupeeSign, FaAmbulance,
  FaFileInvoiceDollar, FaPills, FaClock,
} from "react-icons/fa";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import StatCard from "../../components/Cards/StatCard";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/admin");
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
      <DashboardLayout title="Admin Dashboard">
        <Loader />
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};

  const revenueData = {
    labels: data?.revenueByMonth?.map((r) => r.month) || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: data?.revenueByMonth?.map((r) => r.revenue) || [],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.12)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const patientData = {
    labels: data?.patientsByMonth?.map((p) => p.month) || [],
    datasets: [
      {
        label: "New Patients",
        data: data?.patientsByMonth?.map((p) => p.patients) || [],
        backgroundColor: "#0ea5e9",
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.15)" } }, x: { grid: { display: false } } },
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="stats-grid">
        <StatCard icon={<FaUserMd />} label="Total Doctors" value={stats.totalDoctors} color="primary" />
        <StatCard icon={<FaUserInjured />} label="Total Patients" value={stats.totalPatients} color="info" />
        <StatCard icon={<FaCalendarCheck />} label="Appointments" value={stats.totalAppointments} color="success" />
        <StatCard icon={<FaClock />} label="Pending Appointments" value={stats.pendingAppointments} color="warning" />
        <StatCard icon={<FaRupeeSign />} label="Total Income" value={`₹${(stats.income || 0).toLocaleString()}`} color="success" />
        <StatCard icon={<FaFileInvoiceDollar />} label="Pending Bills" value={stats.pendingBills} color="danger" />
        <StatCard icon={<FaAmbulance />} label="Emergency Cases" value={stats.emergencyCases} color="danger" />
        <StatCard icon={<FaPills />} label="Low Medicine Stock" value={stats.lowStockMedicines} color="warning" />
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <h3>Revenue Overview</h3>
          <Line data={revenueData} options={chartOptions} />
        </div>
        <div className="card chart-card">
          <h3>Patient Registrations</h3>
          <Bar data={patientData} options={chartOptions} />
        </div>
      </div>

      <div className="card recent-card">
        <h3>Recent Appointments</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data?.recentAppointments?.length ? data.recentAppointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.user?.name || "—"}</td>
                  <td>{a.doctor?.user?.name || "—"}</td>
                  <td>{new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.time}</td>
                  <td><span className={`badge badge-${a.status === "approved" ? "success" : a.status === "pending" ? "warning" : a.status === "rejected" || a.status === "cancelled" ? "danger" : "info"}`}>{a.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--text-muted)" }}>No appointments yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

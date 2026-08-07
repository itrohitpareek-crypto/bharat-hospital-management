import React, { useEffect, useState } from "react";
import { FaCalendarCheck, FaUserInjured, FaCheckCircle, FaClock } from "react-icons/fa";
import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import StatCard from "../../components/Cards/StatCard";
import Loader from "../../components/Loader/Loader";
import api from "../../services/api";
import "./Dashboard.css";

const DoctorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/dashboard/doctor");
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
      <DashboardLayout title="Doctor Dashboard">
        <Loader />
      </DashboardLayout>
    );
  }

  const stats = data?.stats || {};

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="stats-grid">
        <StatCard icon={<FaCalendarCheck />} label="Total Appointments" value={stats.totalAppointments} color="primary" />
        <StatCard icon={<FaCheckCircle />} label="Completed" value={stats.completedAppointments} color="success" />
        <StatCard icon={<FaClock />} label="Pending" value={stats.pendingAppointments} color="warning" />
        <StatCard icon={<FaUserInjured />} label="Total Patients" value={stats.totalPatients} color="info" />
      </div>

      <div className="card recent-card">
        <h3>Today's Appointments</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Patient</th><th>Time</th><th>Reason</th><th>Status</th></tr>
            </thead>
            <tbody>
              {data?.todayAppointments?.length ? data.todayAppointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patient?.user?.name || "—"}</td>
                  <td>{a.time}</td>
                  <td>{a.reason || "—"}</td>
                  <td><span className={`badge badge-${a.status === "approved" ? "success" : a.status === "pending" ? "warning" : "info"}`}>{a.status}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-muted)" }}>No appointments scheduled for today</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;

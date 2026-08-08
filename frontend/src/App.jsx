import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";

import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DoctorDashboard from "./pages/Dashboard/DoctorDashboard";
import PatientDashboard from "./pages/Dashboard/PatientDashboard";

import DoctorsList from "./pages/Doctor/DoctorsList";
import PatientsList from "./pages/Patient/PatientsList";
import MyPatients from "./pages/Patient/MyPatients";
import Appointments from "./pages/Appointment/Appointments";
import Billing from "./pages/Billing/Billing";
import Pharmacy from "./pages/Pharmacy/Pharmacy";
import Laboratory from "./pages/Laboratory/Laboratory";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/doctors" element={<ProtectedRoute allowedRoles={["admin"]}><DoctorsList /></ProtectedRoute>} />
        <Route path="/admin/patients" element={<ProtectedRoute allowedRoles={["admin"]}><PatientsList /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={["admin"]}><Appointments /></ProtectedRoute>} />
        <Route path="/admin/billing" element={<ProtectedRoute allowedRoles={["admin"]}><Billing /></ProtectedRoute>} />
        <Route path="/admin/pharmacy" element={<ProtectedRoute allowedRoles={["admin"]}><Pharmacy /></ProtectedRoute>} />
        <Route path="/admin/laboratory" element={<ProtectedRoute allowedRoles={["admin"]}><Laboratory /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><Settings /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["admin"]}><Profile /></ProtectedRoute>} />

        {/* Doctor routes */}
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/doctor/appointments" element={<ProtectedRoute allowedRoles={["doctor"]}><Appointments /></ProtectedRoute>} />
        <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={["doctor"]}><MyPatients /></ProtectedRoute>} />
        <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={["doctor"]}><Profile /></ProtectedRoute>} />

        {/* Patient routes */}
        <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={["patient"]}><Appointments /></ProtectedRoute>} />
        <Route path="/patient/billing" element={<ProtectedRoute allowedRoles={["patient"]}><Billing /></ProtectedRoute>} />
        <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={["patient"]}><Profile /></ProtectedRoute>} />

        {/* 404 fallback */}
        <Route path="*" element={<Landing />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
    </>
  );
}

export default App;
import React from "react";
import "./StatCard.css";

const StatCard = ({ icon, label, value, trend, color = "primary" }) => {
  return (
    <div className="stat-card card fade-in">
      <div className={`stat-icon stat-icon-${color}`}>{icon}</div>
      <div className="stat-info">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
    </div>
  );
};

export default StatCard;

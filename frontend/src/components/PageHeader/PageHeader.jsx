import React from "react";
import "./PageHeader.css";

const PageHeader = ({ title, subtitle, action }) => (
  <div className="page-header">
    <div>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {action && <div className="page-header-action">{action}</div>}
  </div>
);

export default PageHeader;

import React from "react";
import "./Loader.css";

const Loader = ({ fullScreen, size = "md" }) => {
  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className={`spinner spinner-${size}`}></div>
      </div>
    );
  }
  return <div className={`spinner spinner-${size}`}></div>;
};

export default Loader;

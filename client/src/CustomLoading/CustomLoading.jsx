import React from "react";
import "../CustomLoading/CustomLoading.css";

const CustomLoading = ({
  text = "Loading",
  color = "#fff",
  size = "medium",
}) => {
  return (
    <>
      <div className={`custom-loading ${size}`} style={{ color: color }}>
        <div className="loading-text">{text}</div>
        <div className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </>
  );
};

export default CustomLoading;

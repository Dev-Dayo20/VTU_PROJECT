import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import devdlogo from "../assets/devdlogo.png";

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar bg-dark">
      <div className="nav-items ">
        <Link to="/dashboard" className="navbar-brand">
          {/* <img src={devdlogo} style={{width: "5%"}}/> */}
          DevdPlug
        </Link>
      </div>
      <Link to="/login" className="btn btn-danger" onClick={handleLogout}>
        Logout
      </Link>
    </nav>
  );
};

export default Navbar;

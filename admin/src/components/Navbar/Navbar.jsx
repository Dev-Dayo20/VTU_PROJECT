import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css";
import { Container } from "react-bootstrap";

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar bg-dark">
      <div className="nav-items ">
        <Link to="/admin/dashboard" className="navbar-brand">
          DevdPlug
        </Link>
      </div>
      {/* <Link to="/" className="btn btn-danger" onClick={handleLogout}>
        Logout
      </Link> */}
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  // const history = useHistory();

  // const Isloggedin = !!localStorage.getItem("token");

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   history.push("/login");
  // };
  return (
    <div>
      <div>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-danger mb-5">
          <div className="container-fluid">
            <div className="navbar-brand">Data Reseller</div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/login"
                    className="nav-link active"
                    aria-current="page"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;

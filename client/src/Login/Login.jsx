import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import axios from "axios";
import devdlogo from "../assets/devdlogo.png";
import { Modal, Button, Form, Image } from "react-bootstrap";

const Login = () => {
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate("");
  const { email, password } = formData;

  //Javascript spread operator
  const onChange = async (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    // Check if fields are empty before sending request
    if (!email || !password) {
      setModalMessage("Email and password are required!");
      setShowModal(true);
      return;
    }

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const body = JSON.stringify({
        email,
        password,
      });

      const res = await axios.post(
        "http://localhost:2500/devdplug/login",
        body,
        config
      );
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      if (error && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        errors.forEach((err) => {
          if (err.param === "email") {
            setEmailError(err.msg);
          }
          if (err.param === "password") {
            setPasswordError(err.msg);
          } else {
            setModalMessage("Invalid credentials or server error!");
            setShowModal(true);
          }
        });
      }
    }
  };

  return (
    <>
      <section className="login-section">
        <div className="container py-5 d-flex align-items-center justify-content-center">
          <div className="row pt-5">
            <div className="col-lg-4 col-md-6 col-sm-8 mx-auto"></div>
            <div className="card p-4 shadow-lg">
              <div className="d-flex align-items-center">
                <img
                  src={devdlogo}
                  alt="Devd Logo"
                  style={{ width: "100px", marginBottom: "20px" }}
                />
                <div className="card-title mx-auto">
                  <h3 className="text-danger">Login</h3>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={onSubmit}>
                  <label htmlFor="Email" className="form-label mb-3 fw-bold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control mb-3"
                    id="exampleFormControlInput1"
                    placeholder="name@example.com"
                    name="email"
                    onChange={onChange}
                    value={email}
                  />
                  {emailError && (
                    <p className="text-danger mb-5 fw-medium">{emailError}</p>
                  )}
                  <label htmlFor="Password" className="form-label mb-3 fw-bold">
                    Enter Your Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    maxLength="12"
                    className="form-control mb-3"
                    id="password"
                    placeholder="enter your password"
                    name="password"
                    onChange={onChange}
                    value={password}
                  />
                  {passwordError && (
                    <p className="text-danger mb-2 fw-medium">
                      {passwordError}
                    </p>
                  )}

                  <p>
                    <Link
                      to=""
                      className="text-decoration-none text-danger fw-medium"
                    >
                      Forgot Password?
                    </Link>
                  </p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-danger">Login</button>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <h6>
                    Don't have an account?{" "}
                    <span>
                      <Link
                        to="/register"
                        className="text-decoration-none text-danger"
                      >
                        Sign Up
                      </Link>
                    </span>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Error</Modal.Title>
        </Modal.Header>
        <Modal.Body className="fw-medium">{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className="btn btn-danger"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;

import React, { useState } from "react";
import "../Register/Register.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import devdlogo from "../assets/devdlogo.png";
import "sweetalert2/dist/sweetalert2.min.css";
import { Modal, Button, Spinner } from "react-bootstrap";

const Register = () => {
  const [formData, setformData] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    referralCode: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate("");
  const {
    name,
    username,
    email,
    phoneNumber,
    referralCode,
    password,
    confirmPassword,
  } = formData;
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const [modalTitle, setModalTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password" && e.target.value.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be 6 or more charcters",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    if (
      (e.target.name === "password" || e.target.name === "confirmPassword") &&
      errors.confirmPassword
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "",
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Password do not match" });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const body = JSON.stringify({
        name,
        username,
        email,
        phoneNumber,
        referralCode,
        password,
      });
      await axios.post("http://localhost:2500/devdplug/register", body, config);
      setModalTitle("Success!");
      setModalMessage("You have successfully signed up");
      setVariant("success");
      setShowModal(true);

      setformData({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        referralCode: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});
    } catch (error) {
      setLoading(true);
      if (error.response && error.response.data.errors) {
        const backEndErrors = error.response.data.errors.reduce((acc, err) => {
          acc[err.param] = err.msg;
          return acc;
        }, {});
        setErrors(backEndErrors);
      } else {
        setModalTitle("Error");
        setModalMessage("Something went wrong");
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (modalTitle === "Success!") {
      navigate("/login");
    }
  };

  return (
    <>
      <section className="reg-section bg-danger">
        <div
          className="container py-5 d-flex align-items-center justify-content-center"
          id="reg-container"
        >
          <div className="row pt-5">
            <div className="col-lg-4 col-md-6 col-sm-8 mx-auto"></div>
            <div className="card p-5 shadow-sm" id="reg-card">
              <div className="d-flex align-items-center">
                <img
                  src={devdlogo}
                  alt="Devd Logo"
                  style={{ width: "100px", marginBottom: "20px" }}
                />
                <div className="card-title mx-auto">
                  <h4 className="text-danger">Sign up</h4>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={onSubmit}>
                  <label htmlFor="name" className="form-label mb-3 fw-bold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    id="name"
                    name="name"
                    value={name}
                    onChange={onChange}
                    placeholder="enter your name"
                    required
                  ></input>
                  {errors.name && <p className="text-danger">{errors.name}</p>}
                  <label htmlFor="username" className="form-label mb-3 fw-bold">
                    User Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    id="username"
                    name="username"
                    value={username}
                    onChange={onChange}
                    placeholder="enter your username"
                    required
                  ></input>
                  {errors.username && (
                    <p className="text-danger fw-bold">{errors.username}</p>
                  )}
                  <label htmlFor="email" className="form-label mb-3 fw-bold">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control mb-3"
                    id="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="enter your email"
                    required
                  ></input>
                  {errors.email && (
                    <p className="text-danger">{errors.email}</p>
                  )}
                  <label
                    htmlFor="phoneNumber"
                    className="form-label mb-3 fw-bold"
                  >
                    Enter phone Number<span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control mb-3"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={onChange}
                    placeholder="enter your password"
                    required
                  ></input>
                  {errors.phoneNumber && (
                    <p className="text-danger">{errors.phoneNumber}</p>
                  )}
                  <label
                    htmlFor="referralCode"
                    className="form-label mb-3 fw-bold"
                  >
                    Refferal Link
                  </label>
                  <input
                    type="text"
                    className="form-control mb-3"
                    id="referralCode"
                    name="referralCode"
                    value={referralCode}
                    onChange={onChange}
                    placeholder="Referral Link (Optional)"
                  ></input>
                  {/* {errors.phoneNumber && (
                    <p className="text-danger">{errors.phoneNumber}</p>
                  )} */}

                  <label htmlFor="password" className="form-label mb-3 fw-bold">
                    Create a password<span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    id="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="enter your password"
                    required
                  ></input>
                  {errors.password && (
                    <p className="text-danger">{errors.password}</p>
                  )}
                  <label
                    htmlFor="confirmPassword"
                    className="form-label mb-3 fw-bold"
                  >
                    Confirm your password<span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control mb-3"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={onChange}
                    placeholder="confirm your password"
                    required
                  ></input>
                  {errors.confirmPassword && (
                    <p className="text-danger fw-bold">
                      {errors.confirmPassword}
                    </p>
                  )}

                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-danger"
                      type="submit"
                      id="submit-id"
                      disabled={loading}
                    >
                      {loading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                </form>
              </div>
              <p>
                Already have an account?
                <span>
                  <Link
                    to="/login"
                    className="text-decoration-none text-danger"
                  >
                    Login
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          {modalTitle == "Success!" ? (
            <Modal.Title className="text-success">{modalTitle}</Modal.Title>
          ) : (
            <Modal.Title className="text-danger">{modalTitle}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant={variant} onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Register;

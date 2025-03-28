import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../Sidebar/Sidebar";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Utils/AuthProvider";

const AddUser = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const { name, username, email, phoneNumber, password, confirmPassword } =
    formDetails;

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    message: "",
    variant: "danger",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const onChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
    if (e.target.name === "password" && e.target.value < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must to be atleast 6 or more characters",
      }));
    } else if (
      ((e.target.name === "password" || e.target.name === "confirmPassword") &&
        errors.confirmPassword) ||
      errors.password
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
        confirmPassword: "",
      }));
    }
  };

  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Password do not match",
      }));
    }

    const config = { headers: { "Content-Type": "application/json" } };
    const body = JSON.stringify({
      name,
      username,
      email,
      phoneNumber,
      password,
    });

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:2500/devdplug/register",
        body,
        config
      );
      if (response.data.success) {
        setShowModal(true);
        setModalMessage({
          title: "Success",
          message: "User register successful",
          variant: "success",
        });
      }
      setFormDetails({
        name: "",
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      setLoading(true);
      setShowModal(true);

      console.log(error);
      if (error && error.response?.data && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errors.forEach((err) => {
          if (err.param === "email") {
            setModalMessage({
              title: "Error",
              message: err.msg,
              variant: "danger",
            });
          } else if (err.param === "username") {
            setModalMessage({
              title: "Error",
              message: err.msg,
              variant: "danger",
            });
          }
        });
      } else if (error.response?.status === 401) {
        setModalMessage({
          title: "Error",
          message: "Session expired. Please login",
          variant: "danger",
        });
        navigate("/admin/login");
      } else if (!navigator.onLine) {
        setModalMessage({
          title: "Error",
          message: "Network Error. Please check your connections",
          variant: "danger",
        });
      } else {
        setModalMessage({
          title: "Error",
          message: "An error occurred. Please try again",
          variant: "danger",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/admin/manage-user");
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content mt-5">
          <Container className="vh-100 mt-5">
            <Row className="justify-content-center">
              <Col lg={6}>
                <Card className="shadow-sm p-4">
                  <Card.Title className="fs-4 text-dark text-center">
                    Create new user
                  </Card.Title>
                  <Card.Body>
                    <Form onSubmit={createUser}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          Full Name{" "}
                          <span className="text-danger fs-5 fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          name="name"
                          onChange={onChange}
                          placeholder="Enter full name"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          Username{" "}
                          <span className="text-danger fs-5 fw-bold">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={username}
                          name="username"
                          onChange={onChange}
                          placeholder="Enter Username"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          Email{" "}
                          <span className="text-danger fs-5 fw-bold">*</span>{" "}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={email}
                          name="email"
                          onChange={onChange}
                          placeholder="Enter valid email address"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          Phone Number{" "}
                          <span className="text-danger fs-5 fw-bold">*</span>{" "}
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={phoneNumber}
                          name="phoneNumber"
                          onChange={onChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          Create Password{" "}
                          <span className="text-danger fs-5 fw-bold">*</span>{" "}
                        </Form.Label>
                        <Form.Control
                          type="password"
                          value={password}
                          name="password"
                          onChange={onChange}
                          placeholder="Enter your phone number"
                          required
                        />
                        {errors.password && (
                          <p className="text-danger"> {errors.password} </p>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          Confirm Password{" "}
                          <span className="text-danger fs-5 fw-bold">*</span>{" "}
                        </Form.Label>
                        <Form.Control
                          type="password"
                          value={confirmPassword}
                          name="confirmPassword"
                          onChange={onChange}
                          placeholder="password"
                          required
                        />
                      </Form.Group>
                      {errors.confirmPassword && (
                        <p className="text-danger fw-bold">
                          {" "}
                          {errors.confirmPassword}{" "}
                        </p>
                      )}
                      <div className="d-grid gap-2">
                        <Button
                          variant="danger"
                          type="submit"
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
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => navigate(-1)}
                        >
                          Go Back
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{modalMessage.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalMessage.message}</Modal.Body>
          <Modal.Footer>
            <Button variant={modalMessage.variant} onClick={handleCloseModal}>
              {" "}
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AddUser;

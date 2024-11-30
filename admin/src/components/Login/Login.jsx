import React, { useState } from "react";
import "../Login/Login.css";
import axios from "axios";
import devdlogo from "../../assets/devdlogo.png";
import { Link, useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Image,
  Container,
  Row,
  Col,
  Card,
  FloatingLabel,
  Spinner,
} from "react-bootstrap";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    variant: "danger",
  });
  const navigate = useNavigate("");
  const { email, password } = formData;

  const onChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const config = { headers: { "Content-Type": "application/json" } };
      const body = JSON.stringify({ email, password });
      const response = await axios.post(
        "http://localhost:2500/devdplug/admin/login",
        body,
        config
      );
      localStorage.setItem("token", response.data.token);
      navigate("/admin/dashboard");
      console.log(response);
    } catch (error) {
      setLoading(true);
      console.log(error);

      let errorMessage = "An error occurred. Please try again";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (!navigator.onLine) {
        errorMessage = "Network error. Please check your connection.";
      }

      setModalContent({
        title: "Error",
        message: errorMessage,
        variant: "danger",
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="login-section bg-danger">
        <Container className="py-5 d-flex align-items-center justify-content-center">
          <Row className="pt-4">
            <Card className="p-4 shadow-lg">
              <div className="d-flex align-items-center">
                <img
                  src={devdlogo}
                  alt="Devd Logo"
                  style={{ width: "100px", marginBottom: "20px" }}
                />
                <Card.Title className="mx-auto">
                  <h4 className="text-danger">Login As Administrator</h4>
                </Card.Title>
              </div>
              <Card.Body className="">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Email address"
                      className="mb-3"
                    >
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={onChange}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Password"
                    >
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={onChange}
                      />
                    </FloatingLabel>
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button
                      variant="danger"
                      size="lg"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          Authenticating...
                        </span>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </section>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title> {modalContent.title} </Modal.Title>
        </Modal.Header>
        <Modal.Body> {modalContent.message} </Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalContent.variant}
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SIdebar/SIdebar";
import CustomLoading from "../CustomLoading/CustomLoading";

const Airtime = () => {
  const [formData, setFormData] = useState({
    networkId: "",
    amount: "",
    mobileNumber: "",
    portedNumber: false,
    airtimeType: "VTU",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    variant: "info",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validatePhoneNumber = (mobileNumber) => {
      const regex = /^0\d{10}$/;
      return regex.test(mobileNumber);
    };

    if (!validatePhoneNumber(formData.mobileNumber)) {
      setModalContent({
        title: "Error",
        message: "Invalid mobile number format!",
        variant: "danger",
      });
      setShowModal(true);
      return;
    }

    if (
      !formData.networkId ||
      !formData.amount ||
      !formData.mobileNumber ||
      !formData.airtimeType
    ) {
      setModalContent({
        title: "Error",
        message: "Please fill out all the required fields!",
        variant: "danger",
      });
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      // console.log(`Token recieved successfully ${token}`);
      if (!token) {
        setModalContent({
          title: "Error",
          message: "Not Authorized. Invalid Token",
          variant: "danger",
        });
        setShowModal(true);
        return;
      }

      const response = await axios.post(
        "http://localhost:2500/devdplug/purchase-airtime",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModalContent({
        title: "Success",
        message: "Airtime purchased successfully!",
        variant: "success",
      });
      console.log(response);

      setFormData({
        networkId: "",
        amount: "",
        mobileNumber: "",
        portedNumber: false,
        airtimeType: "VTU",
      });
    } catch (error) {
      console.error(error);
      if (error.response) {
        setModalContent({
          title: "Error",
          message:
            error.response.data.error ||
            "An issue occurred during the purchase.",
          variant: "danger",
        });
      } else if (error.request) {
        setModalContent({
          title: "Error",
          message: "Network error. Please check your connection.",
          variant: "danger",
        });
      } else {
        setModalContent({
          title: "Error",
          message: "An error occurred. Please try again",
          variant: "danger",
        });
      }
    } finally {
      setLoading(false);
    }
    setShowModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div
          className="main-content d-flex align-items-center justify-content-center"
          style={{ minHeight: "calc(100vh - 56px)" }}
        >
          <Container>
            <Row className="justify-content-center">
              <Col lg={6}>
                <h2 className="mb-4 text-center">Purchase Airtime</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {" "}
                      <strong>
                        Network <span className="text-danger">*</span>
                      </strong>
                    </Form.Label>
                    <Form.Select
                      name="networkId"
                      value={formData.networkId}
                      onChange={handleChange}
                      // required
                    >
                      <option value="">Select Network</option>
                      <option value="1">MTN</option>
                      <option value="2">Airtel</option>
                      <option value="3">Glo</option>
                      <option value="4">9mobile</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {" "}
                      <strong>
                        Amount <span className="text-danger">*</span>
                      </strong>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      // required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {" "}
                      <strong>
                        Mobile Number <span className="text-danger">*</span>
                      </strong>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      // required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {" "}
                      <strong>
                        Airtime Type <span className="text-danger">*</span>
                      </strong>
                    </Form.Label>
                    <Form.Select
                      name="airtimeType"
                      value={formData.airtimeType}
                      onChange={handleChange}
                      // required
                    >
                      <option value="VTU">VTU</option>
                      <option value="awuf4U">awuf4U</option>
                      <option value="Share and Sell">Share and Sell</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="portedNumber"
                      label="Ported Number"
                      checked={formData.portedNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="danger" type="submit">
                      {loading ? (
                        <CustomLoading text="Please wait" />
                      ) : (
                        "Buy Airtime"
                      )}
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.message}</Modal.Body>
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

export default Airtime;

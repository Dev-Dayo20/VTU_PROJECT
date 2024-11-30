import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Spinner,
  Container,
  Card,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SIdebar/Sidebar";

const BuyData = () => {
  const [networks, setNetworks] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [plans, setPlans] = useState([]);

  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [portedNumber, setPortedNumber] = useState(true);
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    variant: "danger",
  });

  const navigate = useNavigate();
  // Fetch networks from the database
  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug/networks"
        );
        setNetworks(response.data.data);
      } catch (error) {
        console.error(error);
        alert("Failed to fetch networks. Please try again later.");
      }
    };
    fetchNetworks();
  }, []);

  // Fetch plan types when a network is selected
  useEffect(() => {
    if (!selectedNetwork) return;

    const fetchPlanTypes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2500/devdplug/plantypes/${selectedNetwork.networkId}`
        );
        setPlanTypes(response.data.data);
      } catch (error) {
        console.error("Error fetching plan types:", error);
        alert("Failed to fetch plan types. Please try again later.");
      }
    };
    fetchPlanTypes();
  }, [selectedNetwork]);

  // Fetch plans when a plan type is selected
  useEffect(() => {
    if (!selectedPlanType) return;

    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `http://localhost:2500/devdplug/plans/${selectedPlanType.name}`
        );
        setPlans(response.data.plans || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        alert("Failed to fetch plans. Please try again later.");
      }
    };

    fetchPlans();
  }, [selectedPlanType]);

  const handlePurchase = async (e) => {
    e.preventDefault();

    if (!selectedPlan || !phoneNumber) {
      setModal(true);
      setModalContent({
        title: "Error",
        message: "Please select a plan and enter a valid phone number.",
        variant: "danger",
      });
      return;
    }

    const validatePhoneNumber = (phoneNumber) => {
      const regex = /^0\d{10}$/;
      return regex.test(phoneNumber);
    };

    if (!validatePhoneNumber(phoneNumber)) {
      setModal(true);
      setModalContent({
        title: "Error",
        message: "Invalid mobile number format!",
        variant: "danger",
      });
      return;
    }

    const purchaseData = {
      networkId: selectedNetwork.networkId,
      planId: selectedPlan.planId,
      mobileNumber: phoneNumber,
      portedNumber: true,
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        "http://localhost:2500/devdplug/buy-data",
        purchaseData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setModal(true);
        setModalContent({
          title: "Success",
          message: "Data successful",
          variant: "success",
        });
      } else {
        alert(`Purchase failed: ${response.data.error}`);
        setModal(true);
        setModalContent({
          title: "Success",
          message: response.data.error || "Unknown error occurred.",
          variant: "success",
        });
      }

      setSelectedNetwork("");
      setSelectedPlanType("");
      setSelectedPlan("");
      setPhoneNumber("");
      setPlanTypes([]);
      setPlans([]);
    } catch (error) {
      setLoading(true);
      console.error("Error during purchase:", error);

      let errorMessage = "An occurred. Please try again later";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (!navigator.online) {
        errorMessage = "Network error. Please check your connection.";
      }
      setModal(true);
      setModalContent({
        title: "Error",
        message: errorMessage,
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
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
                  <div className="d-flex justify-content-center">
                    <Card.Title className="fw-bold fs-3 text-danger">
                      Purchase Data
                    </Card.Title>
                  </div>
                  <Card.Body>
                    <Form onSubmit={handlePurchase}>
                      {/* Network Dropdown */}
                      <Form.Group>
                        <Form.Label className="mb-2 fw-bold">
                          Select Network
                        </Form.Label>
                        <span className="text-danger fw-bold fs-5">*</span>
                        <Form.Select
                          className="mb-4"
                          onChange={(e) => {
                            const selected = networks.find(
                              (network) => network.networkId === e.target.value
                            );
                            setSelectedNetwork(selected);
                            setSelectedPlanType(null);
                            setSelectedPlan(null);
                            setPlanTypes([]);
                            setPlans([]);
                          }}
                        >
                          <option value="">Select Network</option>
                          {networks.map((network) => (
                            <option key={network._id} value={network.networkId}>
                              {" "}
                              {network.name}{" "}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      {/* Plan Type Dropdown */}
                      {planTypes.length > 0 && (
                        <Form.Group className="mb-4">
                          <Form.Label className="fw-bold">
                            Select Plan Type
                          </Form.Label>
                          <span className="text-danger fw-bold fs-5">*</span>

                          <Form.Select
                            onChange={(e) => {
                              const selected = planTypes.find(
                                (type) => type.name === e.target.value
                              );
                              setSelectedPlanType(selected);
                              setSelectedPlan(null); // Reset selected plan
                              setPlans([]); // Clear plans dropdown
                            }}
                          >
                            <option>Select Plan Type</option>
                            {planTypes.map((type) => (
                              <option key={type._id} value={type.name}>
                                {type.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}

                      {/* Plans Dropdown */}

                      {plans.length > 0 && (
                        <Form.Group>
                          <Form.Label className="fw-bold">
                            Select Plan
                          </Form.Label>
                          <span className="text-danger fw-bold fs-5">*</span>

                          <Form.Select
                            className="mb-4"
                            onChange={(e) =>
                              setSelectedPlan(
                                plans.find(
                                  (plan) => plan.planId === e.target.value
                                )
                              )
                            }
                          >
                            <option value="">Select Plan</option>
                            {plans.map((plan) => (
                              <option key={plan.planId} value={plan.planId}>
                                {" "}
                                {plan.name} - ₦{plan.price}{" "}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )}

                      {/* Phone Number Input */}
                      {selectedPlan && (
                        <>
                          <Form.Group>
                            <Form.Label className="fw-bold">
                              Enter Phone Number
                            </Form.Label>
                            <span className="text-danger fw-bold fs-5">*</span>

                            <Form.Control
                              type="tel"
                              placeholder="Enter Phone Number"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              maxLength={11}
                            />
                            <br />
                            {/* Summary */}
                            <>
                              <h4 className="text-danger">Details</h4>
                              <p>
                                <h6 className="fw-bold">Network:</h6>
                                {selectedNetwork?.name || "Not selected"}{" "}
                              </p>
                              <p>
                                <h6 className="fw-bold">Plan Type:</h6>
                                {selectedPlanType?.name || "Not selected"}{" "}
                              </p>
                              <p>
                                <h6 className="fw-bold">Plan:</h6>{" "}
                                {selectedPlan?.name || "Not selected"}{" "}
                              </p>
                              <p>
                                <h6 className="fw-bold">Phone Number:</h6>
                                {phoneNumber || "Not entered"}{" "}
                              </p>
                            </>
                            <div className="d-grid gap-2">
                              <Button
                                type="submit"
                                variant="danger"
                                disabled={loading}
                              >
                                {loading ? (
                                  <Spinner animation="border" />
                                ) : (
                                  "Proceed"
                                )}
                              </Button>
                            </div>
                          </Form.Group>
                        </>
                      )}
                      <br />
                      <Form.Check
                        type="switch"
                        checked={portedNumber}
                        id="custom-switch"
                        label="Ported Number"
                        onChange={() => setPortedNumber(!portedNumber)}
                      />
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
          <Modal show={modal} onHide={() => setModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{modalContent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalContent.message}</Modal.Body>
            <Modal.Footer>
              <Button
                onClick={() => setModal(false)}
                variant={modalContent.variant}
              >
                close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default BuyData;

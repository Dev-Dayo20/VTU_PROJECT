import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SIdebar/SIdebar";
import { Modal, Button, Form, Image } from "react-bootstrap";

const Data = () => {
  const [networks, setNetworks] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [planTypes, setPlanTypes] = useState({});
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [plans, setPlans] = useState({});
  const [selectedPlan, setSelectedPlan] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [portedNumber, setPortedNumber] = useState(true);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:2500/devdplug/networks").then((response) => {
      setNetworks(response.data.networks);
    });
  }, []);

  const handleNetworkChange = (event) => {
    const networkId = event.target.value;
    setSelectedNetwork(networkId);
    if (networks[networkId]) {
      setPlanTypes(
        networks[networkId][Object.keys(networks[networkId])[0]].planType || {}
      );
    } else {
      setPlanTypes({});
      ``;
    }
    setSelectedPlanType("");
    setPlans({});
    setSelectedPlan("");
  };

  const handlePlanTypeChange = (event) => {
    const planType = event.target.value;
    setSelectedPlanType(planType);
    if (planTypes[planType]) {
      setPlans(planTypes[planType].plans || {});
    } else {
      setPlans({});
    }
    setSelectedPlan("");
  };
  // Handle Plan Function
  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  // Helper function to validate phone number (Nigerian numbers)
  const validatePhoneNumber = (number) => {
    const regex = /^0\d{10}$/;
    return regex.test(number);
  };

  // Handle Data Purchase funtion
  const handlePurchase = async () => {
    setPhoneNumberError("");
    setErrorVisible(false);

    setTimeout(() => {
      setErrorVisible(true);
    }, 100);
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError("Please enter a phone number (11 digits).");
      return;
    }

    if (!selectedPlan) {
      setShowModal(true);
      setModalMessage("Error, Please select a data plan");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:2500/devdplug/purchase-data",
        {
          phoneNumber,
          networkId: selectedNetwork,
          plans: selectedPlan,
          portedNumber,
        }
      );

      setShowModal(true);
      setModalMessage("Data purchase successful");
    } catch (error) {
      // Handle backend validation or API errors
      if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors;
        errors.forEach((err) => {
          if (err.param === "phoneNumber") {
            setPhoneNumberError(err.msg);
          }
        });
      } else {
        setShowModal(true);
        setModalMessage("Error, Failed to purcahse data. No wallet found");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div className="container vh-100 py-5">
            <div className="row justify-content-center">
              <div className="col-lg-6 mt-5">
                <div className="card shadow-sm p-4">
                  <h2 className="text-center mb-4">Purchase Data</h2>
                  <div className="mb-3">
                    <label className="form-label">
                      <strong>
                        Enter Phone Number{" "}
                        <span className="text-danger">*</span>
                      </strong>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      maxLength={11}
                      required
                    />
                    {phoneNumberError && errorVisible && (
                      <p className="text-danger mb-5 fw-medium">
                        {phoneNumberError}
                      </p>
                    )}
                  </div>
                  {/* Network Dropdown */}
                  <div className="mb-3">
                    <label label className="form-label">
                      <strong>
                        Select Network <span className="text-danger">*</span>
                      </strong>
                    </label>
                    <select
                      className="form-select"
                      onChange={handleNetworkChange}
                      value={selectedNetwork}
                    >
                      <option value="" disabled>
                        Select Network
                      </option>
                      {Object.entries(networks).map(([id, network]) => (
                        <option key={id} value={id}>
                          {Object.keys(network)[0]} {/* Display network name */}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Plan Type Dropdown */}
                  {selectedNetwork && (
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>
                          Select Plan Type{" "}
                          <span className="text-danger">*</span>
                        </strong>
                      </label>
                      <select
                        className="form-select"
                        onChange={handlePlanTypeChange}
                        value={selectedPlanType}
                      >
                        <option value="" disabled>
                          Select Plan Type
                        </option>
                        {Object.keys(planTypes).map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Plan Dropdown */}
                  {selectedPlanType && (
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>
                          Select Plan <span className="text-danger">*</span>
                        </strong>
                      </label>
                      <select
                        className="form-select"
                        onChange={handlePlanChange}
                        value={selectedPlan}
                      >
                        <option value="" disabled>
                          Select Plan
                        </option>
                        {Object.entries(plans).map(([id, planName]) => (
                          <option key={id} value={id}>
                            {planName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Ported Number Check */}
                  <div className="mb-3">
                    <label htmlFor="" className="form-label">
                      Is ported number
                    </label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={portedNumber}
                      onChange={() => setPortedNumber(!portedNumber)}
                    />
                  </div>
                  {/* Purchase Button */}
                  {selectedPlan && (
                    <button className="btn btn-danger" onClick={handlePurchase}>
                      Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default Data;

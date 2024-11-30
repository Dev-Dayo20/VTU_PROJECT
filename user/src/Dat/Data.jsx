import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SIdebar/Sidebar";
import { Modal, Button, Form, Image } from "react-bootstrap";
import CustomLoading from "../CustomLoading/CustomLoading";

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
  const [modalMessage, setModalMessage] = useState({
    title: "",
    message: "",
    variant: "info",
  });
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  const [Isloading, setIsLoading] = useState(false);

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
    const planId = event.target.value;
    setSelectedPlan(planId);
    if (planId && plans[planId]) {
      setSelectedPlanData(plans[planId]);
    } else {
      setSelectedPlanData(null);
    }
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

    if (!selectedPlan || !selectedNetwork) {
      setShowModal(true);
      setModalMessage({
        title: "Error",
        message: "Please select a data plan",
        variant: "danger",
      });
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:2500/devdplug/purchase-data",
        {
          phoneNumber,
          networkId: selectedNetwork,
          plans: selectedPlan,
          portedNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setModalMessage({
          title: "Success",
          message: "Data purchase successfully",
          variant: "danger",
        });
        setShowModal(true);
      }

      // Reset form fields after successful purchase
      setPhoneNumber("");
      setSelectedNetwork("");
      setSelectedPlanType("");
      setSelectedPlan("");
      setPlanTypes({});
      setPlans({});
    } catch (error) {
      console.error(error);
      if (error.response) {
        const errorMessage =
          error.response.data.error || "An error occurred during the purchase";
        setModalMessage({
          title: "Error",
          message: errorMessage,
          variant: "danger",
        });
      } else if (error.request) {
        setModalMessage({
          title: "Error",
          message: "Please check your internet connection and try again",
          variant: "danger",
        });
      } else {
        setModalMessage({
          title: "Error",
          message: "An unexpected error occurred. Please try again",
          variant: "danger",
        });
      }
      setShowModal(true);
    } finally {
      setIsLoading(false);
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
                        {Object.entries(plans).map(([id, planData]) => (
                          <option key={id} value={id}>
                            {planData.name} - ₦{planData.price}
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
                    <button
                      className="btn btn-danger"
                      onClick={handlePurchase}
                      disabled={Isloading}
                    >
                      {Isloading ? (
                        <CustomLoading text="Please wait" size="small" />
                      ) : (
                        "Buy Data"
                      )}
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
          <Modal.Title className="dark"> {modalMessage.title} </Modal.Title>
        </Modal.Header>
        <Modal.Body className="fw-medium">{modalMessage.message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant={modalMessage.variant}
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

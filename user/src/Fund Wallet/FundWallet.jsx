import React, { useState } from "react";
import "./FundWallet.css";
import CustomLoading from "../CustomLoading/CustomLoading";
import devdlogo from "../assets/devdlogo.png";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const FundWallet = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Handle payment initiation
  const handlePayment = async () => {
    if (!amount || isNaN(amount)) {
      setModalMessage("Please enter a valid amount greater than zero.");
      setShowModal(true);
      return;
    } else if (amount <= 99) {
      setModalMessage(
        `${amount} not a valid amount. Amount has to be 100.00 and above `
      );
      setShowModal(true);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setModalMessage("You are not authenticated. Please log in.");
        setShowModal(true);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:2500/devdplug/paystack/initiate",
        {
          amount,
        },
        config
      );

      // Redirect to Paystack payment page
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error("Error initiating payment:", error);
      console.error("Error initiating payment:", error.response || error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setModalMessage(
          error.response.data.message ||
            "An error occurred while processing your request."
        );
      } else if (error.request) {
        // The request was made but no response was received
        setModalMessage(
          "No response received from the server. Please try again later."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setModalMessage("An unexpected error occurred. Please try again.");
      }
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="fund-section bg-danger">
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
                  <h4 className="text-danger ">Fund Wallet</h4>
                </div>
              </div>
              <div className="card-body">
                <label htmlFor="Number" className="form-label mb-3 fw-bold">
                  Enter Amount <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control mb-3"
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="btn btn-danger"
                >
                  {loading ? (
                    <CustomLoading text="Please wait" size="small" />
                  ) : (
                    "Fund Wallet"
                  )}
                </button>
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
          <Button variant="danger" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FundWallet;

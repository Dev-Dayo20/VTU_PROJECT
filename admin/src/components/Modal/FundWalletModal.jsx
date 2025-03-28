import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import ManageUserModal from "./ManageUserModal";

const FundWalletModal = ({ show, handleClose, userInfo, userWallet }) => {
  const [inputs, setInputs] = useState({
    amount: "",
    email: "",
  });
  const [inputErrors, setInputErrors] = useState({
    amount: "",
    email: "",
  });

  const { amount, email } = inputs;

  const onInputType = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (e.target.name === "amount" && e.target.value < 100) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        amount: `${amount} is not a valid amount.`,
      }));
      return;
    } else {
      setInputErrors({});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter user email",
      }));
      return;
    }

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const body = { amount, email };

    try {
      const response = await axios.post(
        "http://localhost:2500/devdplug/admin/fundwallet",
        body,
        config
      );
      console.log(response);
      if (response.data.success) {
        window.location.href = response.data.authorization_url;
      }
    } catch (error) {
      console.error(error);
    }
    console.log("Funding wallet with amount:", amount);
    handleClose();
  };
  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Fund Wallet for {userInfo.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                Current Balance: ₦
                {parseFloat(userWallet?.balance || 0).toLocaleString()}
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                name="amount"
                onChange={onInputType}
                required
              />
              {inputErrors.amount && (
                <p className="text-danger fw-medium"> {inputErrors.amount} </p>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email Address:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={email}
                name="email"
                onChange={onInputType}
                required
              />
              {inputErrors.email && (
                <p className="text-danger fw-bold">{inputErrors.email}</p>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleSubmit}>
            Fund Wallet
          </Button>
        </Modal.Footer>
      </Modal>
      <ManageUserModal />
    </>
  );
};

export default FundWalletModal;

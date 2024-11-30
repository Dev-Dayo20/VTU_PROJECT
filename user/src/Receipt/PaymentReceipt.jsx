import React, { useEffect, useState } from "react";
import "../Receipt/Receipt.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, Spinner } from "react-bootstrap";
import ReceiptPDFGenerator from "../ReceiptPDF/ReceiptPDFGenerator";
import devdlogo from "../assets/devdlogo.png";

const PaymentReceipt = () => {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { reference } = useParams();

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!reference) {
        setError("No reference found in URL");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:2500/devdplug/transaction-details/${reference}`
        );
        setTransactionDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load transaction details");
        setLoading(false);
        navigate("/dashboard");
      }
    };

    if (reference) {
      fetchTransactionDetails();
    } else {
      setError("No reference found in URL");
      setLoading(false);
    }
  }, [reference, navigate]);

  if (loading) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
      id="receipt"
    >
      <Card
        className="shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <Card.Header className="text-center">
          <h2 className="text-danger">Transaction Successful</h2>
        </Card.Header>
        <Card.Body>
          <p>
            <strong>Username:</strong> {transactionDetails.user}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₦{transactionDetails.amountPaid}
          </p>
          <p>
            <strong>Transaction Date:</strong>{" "}
            {new Date(transactionDetails.date).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {transactionDetails.payment_status === "success"
              ? "Payment Successful"
              : "Payment Failed"}
          </p>
          <p>
            <strong>Reference:</strong> {transactionDetails.payment_reference}
          </p>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button variant="danger" onClick={() => navigate("/dashboard")}>
            Complete
          </Button>
          <ReceiptPDFGenerator
            transactionDetails={transactionDetails}
            logoUrl={devdlogo} // Pass the imported logo as the logo URL
          />
        </Card.Footer>
      </Card>
    </div>
  );
};

export default PaymentReceipt;

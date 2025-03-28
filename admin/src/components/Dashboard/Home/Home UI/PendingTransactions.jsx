import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";

const PendingTransactions = () => {
  const [transactions, setTransactions] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:2500/devdplug/admin/transactions",
          config
        );
        setTransactions(response.data.showPendingTransactions);
      } catch (error) {
        setLoading(true);
        console.log(error);
        // if (error.response?.status === 401) {
        //   console.log("Token expired. Redirecting to login.");
        //   localStorage.removeItem("token");
        //   navigate("/admin/login");
        // } else {
        //   console.log("An error occurred. Please try again.");
        // }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [navigate]);

  return (
    <>
      <Card bg="" border="warning" className="">
        <Card.Body className="d-flex align-items-center justify-content-between">
          <div>
            <Card.Title>
              <h4 className="">Pending Transactions</h4>
            </Card.Title>
            <Card.Subtitle className="">
              Total pending transactions
            </Card.Subtitle>
          </div>
          {loading ? (
            <Spinner animation="border" variant="danger" />
          ) : (
            <h3 className=""> {transactions} </h3>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default PendingTransactions;

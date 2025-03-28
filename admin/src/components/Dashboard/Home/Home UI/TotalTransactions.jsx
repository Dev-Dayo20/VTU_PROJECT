import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";

const TotalTransactions = () => {
  const [transactions, setTransactions] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:2500/devdplug/admin/transactions",
          config
        );
        setTransactions(response.data.totalTransactions);
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
    fetchTotalUsers();
  }, [navigate]);

  return (
    <>
      <Card bg="" border="dark" className="text-dark">
        <Card.Body className="d-flex align-items-center justify-content-between">
          <div>
            <Card.Title>
              <h4 className="">Transactions</h4>
            </Card.Title>
            <Card.Subtitle>Total Transactions</Card.Subtitle>
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

export default TotalTransactions;

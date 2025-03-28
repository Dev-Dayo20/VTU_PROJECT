import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spinner, Badge } from "react-bootstrap";
const RecentTransactions = () => {
  const [transaction, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug//admin/recent-activities",
          config
        );
        setTransactions(response.data.recentTransactions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentTransactions();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      completed: "success",
      failed: "danger",
      pending: "warning",
    };
    return <Badge bg={colors[status]}>{status}</Badge>;
  };
  return (
    <>
      <h4 className="text-danger mt-4 text-center">Recent Transactions</h4>
      {loading ? (
          <Spinner animation="border" variant="danger" />
        ) : transaction.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Username</th>
                <th>Amount</th>
                <th>Details</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transaction.map((recent) => (
                <tr key={recent._id}>
                  <td> {recent.userId.username} </td>
                  <td> {recent.amount} </td>
                  <td>
                    {" "}
                    {recent.details.network} - {recent.details.phoneNumber} -{" "}
                    {recent.details.planType}{" "}
                  </td>
                  <td> {new Date(recent.createdAt).toLocaleString()} </td>
                  <td> {getStatusBadge(recent.status)} </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No Recent Transactions</p>
        )}
    </>
  );
};

export default RecentTransactions;

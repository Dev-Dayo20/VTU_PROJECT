import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Badge } from "react-bootstrap";
import CustomLoading from "../CustomLoading/CustomLoading";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming token is stored in localStorage
        const response = await axios.get(
          "http://localhost:2500/devdplug/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransactions(response.data.transactions);
        // console.log("Response data:", response.data); // Log to check response
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      pending: "warning",
      completed: "success",
      failed: "danger",
    };
    return <Badge bg={colors[status]}>{status}</Badge>;
  };

  return (
    <>
      <div className="p-3">
        <h2>Recent Transactions</h2>
        {loading ? (
          <CustomLoading
            text="Fetching your recent transactions..."
            color="#000"
            size="large"
          />
        ) : transactions.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                  <td>{transaction.type}</td>
                  <td>₦{transaction.amount}</td>
                  <td>
                    {transaction.details.network &&
                      `${transaction.details.network} - `}
                    {transaction.details.phoneNumber}
                    {transaction.details.planName &&
                      ` - ${transaction.details.planName}`}
                  </td>
                  <td>{getStatusBadge(transaction.status)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No transactions found</p>
        )}
      </div>
    </>
  );
};

export default TransactionHistory;

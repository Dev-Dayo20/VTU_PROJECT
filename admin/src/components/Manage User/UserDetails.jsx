import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import "../Manage User/UserDetails.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import FundWalletModal from "../Modal/FundWalletModal";
import ManageUserModal from "../Modal/ManageUserModal";

const UserDetails = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [userWallet, setUserWallet] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showFundModal, setShowFundModal] = useState(false);
  const [showManageUser, setShowManageUser] = useState(false);

  // Handler functions for modal
  const handleShowModal = () => setShowFundModal(true);
  const handleCloseModal = () => setShowFundModal(false);

  const handleShowManageUserModal = () => setShowManageUser(true);
  const handleCloseManageUserModal = () => setShowManageUser(false);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchDetails = async () => {
        const response = await axios.get(
          `http://localhost:2500/devdplug/admin/users/${id}`
        );
        setUserInfo(response.data.data.user);
        setTransactions(response.data.data.user.transaction);
        setTotalTransactions(response.data.data.totalTransactions);
        setUserWallet(response.data.data.wallet);
      };

      fetchDetails();
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const colors = {
      Active: "success",
      Blocked: "danger",
      Suspended: "warning",
      failed: "danger",
      completed: "success",
      pending: "warning",
    };
    return <Badge bg={colors[status] || "secondary"}> {status} </Badge>;
  };

  return (
    <>
      <Navbar />
      <div className="">
        {/* <Sidebar /> */}
        <div className=" mt-5">
          <Container className="vh-100 mt-5" id="">
            <div className=" p-4">
              <Row>
                <Col sm={12}>
                  <div className="my-5">
                    <h4 className="text-danger mb-4">User Profile</h4>
                    <hr />
                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                      <div>
                        <h2 className="text-center">{userInfo.name}</h2>
                        {userWallet ? (
                          <h5>
                            Wallet Balance:{" "}
                            {`₦${parseFloat(
                              userWallet.balance
                            ).toLocaleString()}`}{" "}
                          </h5>
                        ) : (
                          "0"
                        )}
                        <Button variant="success" onClick={handleShowModal}>
                          Fund Wallet
                        </Button>
                      </div>
                      <div>
                        <span className="fw-bold">Status:</span>{" "}
                        {getStatusBadge(userInfo.status)}
                        <Button
                          className="mx-3 fw-bold"
                          variant="outline-dark"
                          onClick={handleShowManageUserModal}
                        >
                          Update Status
                        </Button>
                      </div>
                    </div>
                    <div className="my-5 d-flex align-items-center justify-content-between">
                      <h4 className="">Transactions</h4>
                      <div>
                        <h5>
                          Total Transaction Perform | {totalTransactions}{" "}
                        </h5>
                      </div>
                    </div>
                    {loading ? (
                      <Spinner animation="border" variant="danger" />
                    ) : transactions?.length > 0 ? (
                      <Table striped bordered hover responsive size="sm">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Network</th>
                            <th>Phone Number</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                              <td>{transaction.type}</td>
                              <td>${transaction.amount}</td>
                              <td>{transaction.details.network}</td>
                              <td>{transaction.details.phoneNumber}</td>
                              <td>{transaction.details.planType}</td>
                              <td>{getStatusBadge(transaction.status)}</td>
                              <td>
                                {new Date(
                                  transaction.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <p>No Transaction History</p>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
            <FundWalletModal
              show={showFundModal}
              handleClose={handleCloseModal}
              userInfo={userInfo}
              userWallet={userWallet}
            />
            <ManageUserModal
              showManageUserModal={showManageUser}
              closeManageUserModal={handleCloseManageUserModal}
              userInfoUser={userInfo}
            />
            <Row></Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default UserDetails;

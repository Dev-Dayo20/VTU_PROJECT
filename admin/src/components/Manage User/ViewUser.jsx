import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Nav,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import "../Manage User/ViewUser.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Utils/AuthProvider";
import { TbArrowBackUp } from "react-icons/tb";

const ViewUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBlockedUsers, setTotalBlockedUsers] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const fetchUsers = async (page = 1, search = "") => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit: 10, search },
    };
    try {
      const response = await axios.get(
        "http://localhost:2500/devdplug/admin/users",
        config
      );

      const {
        users,
        totalPages,
        totalUsers,
        totalActiveUsers,
        totalBlockedUsers,
      } = response.data;
      setUsers(users);
      setTotalPage(totalPages);
      setTotalUsers(totalUsers);
      setTotalActiveUsers(totalActiveUsers);
      setTotalBlockedUsers(totalBlockedUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const onSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginationItems = () => {
    let items = [];
    for (let number = 1; number <= totalPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => onPageChange(number)}
        >
          {" "}
          {number}{" "}
        </Pagination.Item>
      );
    }
    return items;
  };

  const statusBadge = (status) => {
    const colors = {
      Active: "success",
      Blocked: "danger",
      Suspended: "warning",
    };
    return <Badge bg={colors[status]}>{status}</Badge>;
  };
  return (
    <>
      <Navbar />
      <Container className="dashboard-container">
        <Sidebar />
        <div className="main-content py-5">
          <div className="d-flex align-items-center justify-content-between mt-5">
            <div className="d-flex align-items-center">
              <TbArrowBackUp
                className="fs-2 cursor-pointer"
                onClick={() => navigate(-1)}
                id="back-button"
              />
              <h4 className="mx-5">Manage Users</h4>
            </div>
            <Link className="btn btn-success" to="/admin/newuser">
              <span className="fw-bold fs-5">+</span> Add User
            </Link>
          </div>
          <hr />
          {/* Search/filter */}
          <Row>
            <Col md={6}>
              <Form>
                <Form.Control
                  type="search"
                  placeholder="Search by Name or Email"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={onSearch}
                />
              </Form>
            </Col>
            <Col md={6} className="text-end">
              <div>
                Total Users: {totalUsers} | Active Users: {totalActiveUsers} |
                Blocked Users: {totalBlockedUsers}
              </div>
            </Col>
          </Row>

          <div className="mt-5">
            {loading ? (
              <Spinner animation="border" variant="danger" />
            ) : users.length > 0 ? (
              <Table striped bordered hover responsive size="sm">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td> {user.phoneNumber} </td>
                      <td>{statusBadge(user.status)} </td>
                      <td>
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="btn btn-secondary"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center">No user found</p>
            )}

            {totalPage > 1 && (
              <div className="d-flex justify-contents-center">
                <Pagination size="">
                  <Pagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {getPaginationItems()}
                  <Pagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPage}
                  />
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default ViewUser;

import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spinner, Badge } from "react-bootstrap";

const RecentSignups = () => {
  const [recentSignups, setRecentSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentSignups = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug//admin/recent-activities",
          config
        );
        setRecentSignups(response.data.recentSignups);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentSignups();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      Active: "success",
      Blocked: "danger",
      Suspended: "warning",
    };
    return <Badge bg={colors[status]}>{status}</Badge>;
  };
  return (
    <>
      <div className="recent-activities mt-5">
        <h4 className="text-danger text-center mb-3">Recent Signups</h4>
        {loading ? (
          <Spinner animation="border" variant="danger" />
        ) : recentSignups.length > 0 ? (
          <Table striped bordered hover responsive size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentSignups.map((recent) => (
                <tr key={recent._id}>
                  <td> {recent.name} </td>
                  <td> {recent.username} </td>
                  <td> {recent.email} </td>
                  <td> {new Date(recent.createdAt).toLocaleString()} </td>
                  <td> {getStatusBadge(recent.status)} </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No Recent Sign up</p>
        )}
      </div>
    </>
  );
};

export default RecentSignups;

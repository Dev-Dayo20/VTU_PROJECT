import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Spinner } from "react-bootstrap";
import axios from "axios";

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:2500/devdplug/admin/users",
          config
        );
        setBlockedUsers(response.data.totalBlockedUsers);
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
      <Card bg="" border="danger" className="">
        <Card.Body className="d-flex align-items-center justify-content-between">
          <div>
            <Card.Title>
              <h4 className="text-danger">Blocked Users</h4>
            </Card.Title>
            <Card.Subtitle>Total Active Users</Card.Subtitle>
          </div>
          {loading ? (
            <Spinner animation="border" variant="danger" />
          ) : (
            <h3 className=""> {blockedUsers} </h3>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default BlockedUsers;

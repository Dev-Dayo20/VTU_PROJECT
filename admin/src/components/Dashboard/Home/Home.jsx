import { Container, Row, Col, Button } from "react-bootstrap";
import TotalUsers from "./Home UI/TotalUsers";
import ActiveUsers from "./Home UI/ActiveUsers";
import BlockedUsers from "./Home UI/BlockedUsers";
import TotalTransactions from "./Home UI/TotalTransactions";
import FailedTransactions from "./Home UI/FailedTransactions";
import PendingTransactions from "./Home UI/PendingTransactions";
import RecentSignups from "./Home UI/RecentSignups";
import RecentTransactions from "./Home UI/RecentTransactions";
import { useAuth } from "../../../Utils/AuthProvider";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { admin, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const getGreeting = () => {
    let hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <>
      <section>
        <Container className="py-5">
          <h5 className="mt-5 text-danger"> {getGreeting()}! </h5>
          <div className="welcome-section d-flex align-items-center justify-content-between">
            {admin ? (
              <h4>Welcome back, {admin.role}! </h4>
            ) : (
              "Welcome back Admin!"
            )}
            <Button
              onClick={logout}
              variant="danger"
              className="fw-bold"
            >
              Logout
            </Button>
          </div>
          <hr />
          <Row className="mt-4 g-4">
            <Col sm={12} md={6} lg={4}>
              <TotalUsers />
            </Col>
            <Col sm={12} md={6} lg={4}>
              <ActiveUsers />
            </Col>
            <Col sm={12} md={6} lg={4}>
              <BlockedUsers />
            </Col>
            <Col sm={12} md={6} lg={4}>
              <TotalTransactions />
            </Col>
            <Col sm={12} md={6} lg={4}>
              <FailedTransactions />
            </Col>
            <Col sm={12} md={6} lg={4}>
              <PendingTransactions />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Recent Table Activities Section */}
      <section className="">
        <Container>
          <div className="recent-activity bg-dark text-white px-4 py-2">
            <h5 className="">Recent Activity</h5>
          </div>
          <RecentSignups />
          <RecentTransactions />
        </Container>
      </section>
    </>
  );
};

export default Home;

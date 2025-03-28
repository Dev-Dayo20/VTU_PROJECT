import React, { useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import AddPlanModal from "../Modal/AddPlanModal";
import ManagePlans from "../Modal/ManagePlans";

const Plan = ({ Plans }) => {
  const [showModal, setShowModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleManageModal = (plans) => {
    setSelectedPlan(plans);
    setShowManageModal(true);
  };
  const handleCloseManageModal = () => setShowManageModal(false);

  const statusBadge = (status) => {
    const colors = {
      Active: "success",
      Blocked: "danger",
      Suspended: "warning",
      active: "success",
      inactive: "danger",
    };
    return <Badge bg={colors[status]}>{status}</Badge>;
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-between mt-5">
        <h4 className="">Plans</h4>
        <Button variant="dark" onClick={handleShowModal}>
          {" "}
          + Add New Plan
        </Button>
      </div>

      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Plan Type</th>
            <th>Network Name</th>
            <th>Price</th>
            <th>Plan ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Plans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.name || "N/A"}</td>
              <td>{plan.planTypeId?.name || "N/A"}</td>
              <td>{plan.planTypeId?.networkId?.name || "N/A"}</td>
              <td>{plan.price || "N/A"}</td>
              <td>{plan.planId || "N/A"}</td>
              <td>{statusBadge(plan.status)} </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleManageModal(plan)}
                >
                  Manage Plan
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AddPlanModal show={showModal} closeModal={closeModal} />
      <ManagePlans
        show={showManageModal}
        closeModal={handleCloseManageModal}
        selected={selectedPlan}
      />
    </>
  );
};

export default Plan;

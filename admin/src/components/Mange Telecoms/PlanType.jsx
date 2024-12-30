import { useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import ManagePlanType from "../Modal/ManagePLanType";

const PlanType = ({ PlanTypes }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState(null);

  const handleShowModal = (plantype) => {
    setSelectedPlanType(plantype);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

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
      <div className="d-flex align-items-center justify-content-between mt-4">
        <h4 className="">Plan Types</h4>
        <Button variant="outline-dark" className="fw-bold">
          + Add
        </Button>
      </div>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Plan Type</th>
            <th>Network Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {PlanTypes.map((type) => (
            <tr key={type._id}>
              <td>{type.name} </td>
              <td>{type.networkId.name} </td>
              <td>{statusBadge(type.status)} </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleShowModal(type)}
                >
                  Manage Plan Type
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ManagePlanType
        show={showModal}
        closeModal={handleCloseModal}
        planType={selectedPlanType}
      />
    </>
  );
};

export default PlanType;
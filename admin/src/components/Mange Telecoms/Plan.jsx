import React from "react";
import { Table, Badge, Button } from "react-bootstrap";

const Plan = ({ Plans }) => {
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
      <h4 className="mt-5">Plans</h4>
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
              <td>{plan.name}</td>
              <td>{plan.planTypeId.name} </td>
              <td>{plan.planTypeId.networkId.name} </td>
              <td>{plan.price} </td>
              <td>{plan.planId} </td>
              <td>{statusBadge(plan.status)} </td>
              <td>
                <Button variant="secondary">Manage Plan</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default Plan;

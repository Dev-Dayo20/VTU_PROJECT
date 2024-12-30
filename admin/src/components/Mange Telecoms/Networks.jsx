import React, { useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import ManageNetworkModal from "../Modal/ManageNetworkModal";

const Networks = ({ network }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const handleShowModal = (network) => {
    setSelectedNetwork(network);
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
      <h4 className="mt-5">Networks</h4>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Network ID</th>
            <th>Network Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {network.map((networks) => (
            <tr key={networks._id}>
              <td>{networks.name} </td>
              <td> {networks.networkId} </td>
              <td>{statusBadge(networks.status)} </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleShowModal(networks)}
                >
                  Manage Network
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ManageNetworkModal
        network={selectedNetwork}
        show={showModal}
        closeModal={handleCloseModal}
      />
    </>
  );
};

export default Networks;

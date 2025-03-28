import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const ManageNetworkModal = ({ network, show, closeModal }) => {
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:2500/devdplug/admin/update_network/${network._id}`,
        { status, reason }
      );
      if (response.status === 200) {
        alert("Network update successfully");
      } else {
        alert(response?.data?.error || "Something went wrong");
      }
      closeModal();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Internal server errorr");
    }
  };
  return (
    <>
      <Modal show={show} onHide={closeModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Manage Network</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Label className="my-3 fw-bold">
              Update Network Status
            </Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="active">Activate</option>
              <option value="inactive">Inactive</option>
            </Form.Select>

            <Form.Group>
              <Form.Label className="my-3 fw-bold">State Reason</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="submit">
              Proceed
            </Button>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ManageNetworkModal;

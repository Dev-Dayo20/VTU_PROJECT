import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ManageUserModal = ({
  showManageUserModal,
  closeManageUserModal,
  userInfoUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setError("");
  };
  const handleReasonChange = (e) => {
    setReason(e.target.value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!status || !reason) {
      return setError("All fields are required");
    }

    setError("");
    try {
      setLoading(true);
      const response = axios.put(
        `http://localhost:2500/devdplug/admin/users/${userInfoUser._id}`,
        { status, reason }
      );
      console.log(response);
      closeManageUserModal();
    } catch (error) {
      setLoading(true);
      console.error(error);
      setError(error.response?.data?.error || "Failed to update user status");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Modal show={showManageUserModal} onHide={closeManageUserModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update User's Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="fw-bold">Update Status</Form.Label>
              <Form.Select value={status} onChange={handleStatusChange}>
                <option value="" disabled selected>
                  Select Status
                </option>
                <option value="Active">Activate User</option>
                <option value="Blocked">Block User</option>
              </Form.Select>
              {error && <div className="alert alert-danger">{error}</div>}
            </Form.Group>

            <Form.Group className="my-3">
              <Form.Label className="fw-bold">State Reason </Form.Label>
              <Form.Control
                type="text"
                placeholder="optional"
                value={reason}
                onChange={handleReasonChange}
              />
              {error && <div className="alert alert-danger">{error}</div>}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" disabled={loading} type="submit">
              {" "}
              {loading ? "Processing..." : "Proceed"}
            </Button>
            <Button variant="secondary" onClick={closeManageUserModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ManageUserModal;

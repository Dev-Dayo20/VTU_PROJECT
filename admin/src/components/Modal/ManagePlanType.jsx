import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const ManagePlanType = ({ show, closeModal, planType }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:2500/devdplug/admin/update_plantype/${planType._id}`,
        { name, status }
      );
      if (response.status === 200) {
        alert("Plantype update successfully");
      } else {
        alert(response?.data?.error || "Something went wrong");
      }
      console.log(response);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={closeModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h3>Update Plantype</h3>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="my-3 fw-bold">Update Plantype</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="active">Activate Plantype</option>
                <option value="inactive">Deactivate Plantype</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label className="my-3 fw-bold"> Update Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="State reason"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="submit">
              Proceed
            </Button>
            <Button onClick={closeModal} variant="secondary">
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ManagePlanType;

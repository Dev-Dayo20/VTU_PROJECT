import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const ManagePlans = ({ show, closeModal, selected }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    planId: "",
    status: "active",
  });

  useEffect(() => {
    if (selected) {
      setFormData({
        name: selected.name || "",
        price: selected.price || "",
        planId: selected.planId || "",
        status: selected.status || "active",
      });
    }
  }, [selected]);

  const { name, price, planId, status } = formData;

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const updatePlan = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:2500/devdplug/admin/update_plan/${selected._id}`,
        formData
      );
      if (response.status === 200) {
        alert("Plan updated successfully");
        closeModal();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  const deletePlan = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:2500/devdplug/admin/delete_plan/${selected._id}`
      );
      if (response.status) {
        alert("Plan deleted successfully");
        closeModal();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong");
      closeModal();
    }
  };
  return (
    <>
      <Modal show={show} onHide={closeModal} centered>
        <Form onSubmit={updatePlan}>
          <Modal.Header closeButton>
            <Modal.Title>Manage Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="my-2">
              <Form.Label className="fw-bold">Edit Plan Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="new plan name"
                name="name"
                value={name}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="my-2">
              <Form.Label className="fw-bold">Edit Plan Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="new plan price"
                name="price"
                value={price}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="my-2">
              <Form.Label className="fw-bold">Edit Plan ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="new plan ID"
                name="planId"
                value={planId}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="my-2">
              <Form.Label className="fw-bold">Edit Plan Status</Form.Label>
              <Form.Select name="status" onChange={onChange} value={status}>
                <option value="">Select Plan Status</option>
                <option value="active" selected>
                  Active
                </option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit">
              Proceed
            </Button>
            <Button variant="danger" onClick={deletePlan}>
              Delete Plan
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

export default ManagePlans;

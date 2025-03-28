import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddPlanModal = ({ show, closeModal }) => {
  const [planType, setPlanType] = useState([]);
  const [formData, setFormData] = useState({
    planTypeId: "",
    name: "",
    price: "",
    planId: "",
    status: "",
  });

  const { planTypeId, name, price, planId, status } = formData;

  useEffect(() => {
    const fetchPlanType = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug/admin/plantypes"
        );
        setPlanType(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlanType();
  }, []);

  const handleAddPlan = async (e) => {
    e.preventDefault();

    if (!planTypeId) {
      return alert("All fields are required");
    }

    try {
      const response = await axios.post(
        "http://localhost:2500/devdplug/admin/add_plan",
        formData
      );
      if (response === 200) {
        alert("New plan added successfully");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Something went wrong");
    }
    closeModal();
  };

  return (
    <>
      <Modal show={show} onHide={closeModal} centered>
        <Form onSubmit={handleAddPlan}>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">Add New Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold ">PlanTypes</Form.Label>
              <Form.Select
                name="planTypeId"
                value={planTypeId}
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    planTypeId: e.target.value,
                  }))
                }
              >
                <option value="">Select Plantype</option>
                {planType.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold ">Enter New Plan</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }))
                }
                name="name"
                type="text"
                value={name}
                placeholder="Plan name"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold ">Enter Plan Price</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    price: e.target.value,
                  }))
                }
                name="price"
                type="number"
                value={price}
                placeholder="Plan price"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold ">Enter Plan ID</Form.Label>
              <Form.Control
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    planId: e.target.value,
                  }))
                }
                name="planId"
                type="number"
                value={planId}
                placeholder="Plan ID"
              />

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Plan Status</Form.Label>
                <Form.Select
                  value={status}
                  name="status"
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      status: e.target.value,
                    }))
                  }
                >
                  <option value="" disabled>
                    Select Plan Status
                  </option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
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

export default AddPlanModal;

import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddPlanTypeModal = ({ showAddModal, closeAddModal }) => {
  const [networks, setNetworks] = useState([]);
  const [formData, setFormData] = useState({
    networkId: "",
    name: "",
    status: "active",
  });

  const { networkId, name, status } = formData;

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug/admin/getallnetworks"
        );
        setNetworks(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNetworks();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddPlanType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:2500/devdplug/admin/add_plantype",
        formData
      );
      if (response.status === 200) {
        alert("New plantype created successfully");
      } else {
        alert(response?.data?.error || "Something went wrong");
      }
      closeAddModal();
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the plantype.");
    }
  };

  return (
    <>
      <Modal show={showAddModal} onHide={closeAddModal} centered>
        <Form onSubmit={handleAddPlanType}>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">Add New Plantype</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className=" fw-bold">Select Network Type</Form.Label>
              <Form.Select
                name="networkId"
                value={networkId}
                onChange={onChange}
              >
                <option value="" disabled>
                  Select Network
                </option>
                {networks.map((network) => (
                  <option key={network.networkId} value={network._id}>
                    {network.name}{" "}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-2 fw-bold">Enter Plan Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter plan name"
                value={name}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="fw-bold">Select Status</Form.Label>
              <Form.Select name="status" value={status} onChange={onChange}>
                <option value="" disabled>
                  Statuses
                </option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" type="submit">
              Proceed
            </Button>
            <Button variant="secondary" onClick={closeAddModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default AddPlanTypeModal;

import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmDeleteUserAccount = ({
  showDeleteAccountModal,
  closeDeleteAccountModal,
  handleDeleteAccount,
}) => {
  return (
    <>
      <Modal
        show={showDeleteAccountModal}
        onHide={closeDeleteAccountModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="fw-medium">
          {" "}
          Are you sure you want to delete this account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete
          </Button>
          <Button variant="secondary" onClick={closeDeleteAccountModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmDeleteUserAccount;

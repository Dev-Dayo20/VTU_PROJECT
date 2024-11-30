import React from "react";
import { Button, Modal } from "react-bootstrap";

const CustomModal = () => {
  (title = "Success"), (message = "Successfull"), (variant = "danger");
  return (
    <>
      <Modal>
        <Modal.Header>
          <Modal.Title> {title} </Modal.Title>
        </Modal.Header>
        <Modal.Body> {message} </Modal.Body>
        <Modal.Footer>
          <Button variant={variant}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomModal;

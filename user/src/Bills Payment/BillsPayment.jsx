import React from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Modal,
} from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SIdebar/Sidebar";

const BillsPayment = () => {
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
      </div>
    </>
  );
};

export default BillsPayment;

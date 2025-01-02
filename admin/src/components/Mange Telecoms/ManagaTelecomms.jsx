import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Container } from "react-bootstrap";
import Sidebar from "../Sidebar/Sidebar";
import axios from "axios";
import Networks from "./Networks";
import PlanType from "./PlanType";
import Plan from "./Plan";
import AddPlanTypeModal from "../Modal/AddPlanTypeModal";
import AddPlanModal from "../Modal/AddPlanModal";

const ManagaTelecomms = () => {
  const [network, setNetwork] = useState([]);
  const [planTypes, setPlanTypes] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchNetworks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug/admin/getallnetworks"
        );
        setNetwork(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNetworks();
  }, []);

  useEffect(() => {
    const fetchPlanType = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug//admin/plantypes"
        );
        setPlanTypes(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlanType();
  }, []);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2500/devdplug/admin/plans"
        );
        setPlans(response.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlans();
  }, []);

  return (
    <>
      <Navbar />
      <Container className="dashboard-container">
        <Sidebar />
        <div className="main-content py-5">
          <div className=" mt-5">
            <h4 className="text-danger">Manage Telecoms</h4>
            <hr />

            {/* TABLE OF TELECOMMS PROPS COMPONENT */}
            <Networks network={network} />
            <PlanType PlanTypes={planTypes} />
            <Plan Plans={plans} />
            <AddPlanTypeModal Network={network} />

            <AddPlanModal plantype={planTypes} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default ManagaTelecomms;

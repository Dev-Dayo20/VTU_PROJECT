import React from "react";
import "sweetalert2/dist/sweetalert2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import HomePage from "./Frontpage/HomePage";
import Login from "./Login/Login";
import Register from "./Register/Register";
import Services from "./Our/Services";
import Data from "./Dat/Data";
import Airtime from "./Airtime/Airtime";
import ProtectedRoutes from "./Protected/ProtectedRoutes";
import FundWallet from "./Fund Wallet/FundWallet";
import PaymentReceipt from "./Receipt/PaymentReceipt";
import BillsPayment from "./Bills Payment/BillsPayment";
import BuyData from "./NewData/BuyData";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {" "}
      <Routes location={location} key={location.pathname}>
        <Route
          index
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HomePage />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Services />
              </motion.div>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard/data"
          element={
            <ProtectedRoutes>
              <BuyData />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard/airtime"
          element={
            <ProtectedRoutes>
              <Airtime />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard/billspayment"
          element={
            <ProtectedRoutes>
              <BillsPayment />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/dashboard/fund-wallet"
          element={
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FundWallet />
            </motion.div>
          }
        />
        <Route
          path="/dashboard/payment-receipt/:reference"
          element={<PaymentReceipt />}
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;

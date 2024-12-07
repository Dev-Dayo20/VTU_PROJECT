import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Our/Services.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SIdebar/Sidebar";
import Footer from "../Footer/Footer";
import TransactionHistory from "../Transactions/transactionHistory";
import CustomLoading from "../CustomLoading/CustomLoading";
import axios from "axios";
import { CgData } from "react-icons/cg";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegLightbulb } from "react-icons/fa";
import { HiMiniTv } from "react-icons/hi2";
import { BsPeopleFill } from "react-icons/bs";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Modal, Button, Form, Image } from "react-bootstrap";

const ServiceCards = () => {
  const [userdata, setUserData] = useState({
    username: "",
    wallet: 0.0,
  });
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({
    title: "",
    message: "",
    variant: "info",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          "http://localhost:2500/devdplug/dashboard",
          config
        );

        setUserData({
          username: res.data.username,
          wallet: res.data.wallet,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleBills = async () => {
    setShowModal(true);
    setModalMessage({
      title: "Oops",
      message: "Coming Soon!!!",
      variant: "danger",
    });
  };

  const getGreeting = () => {
    let hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 18) return "Good Afternoon!";
    return "Good Evening!";
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <Sidebar />

        {/* Main content */}
        <div className="main-content">
          <div className="sub-header container pt-5 pb-5">
            <h1 className="fs-2 fw-medium text-center mb-3 mt-5">
              Get To Enjoy Our Seamless{" "}
              <span className="text-danger">
                <strong>Services</strong>
              </span>
            </h1>
          </div>

          <section
            className="wallet bg-dark text-light p-4"
            id="wallet-section"
          >
            <div className="container-fluid d-flex justify-content-between flex-wrap">
              <div className="wallet-space ">
                {loading ? (
                  <CustomLoading />
                ) : (
                  <>
                    <h5 className="text-white mb-2">{getGreeting()}</h5>
                    <h2 className="text-danger">
                      Welcome,{" "}
                      <span className="text-white">{userdata.username}</span>!
                    </h2>
                    <p className="fs-5">
                      Wallet Balance:{" "}
                      <span
                        className={`wallet-balance ${
                          userdata.wallet === 0 ? "zero-balance" : ""
                        }`}
                      >
                        {showBalance
                          ? `₦${parseFloat(userdata.wallet).toLocaleString()}`
                          : "₦****"}
                      </span>
                      <Button
                        onClick={() => setShowBalance(!showBalance)}
                        className="btn btn-link text-white ms-2"
                      >
                        {showBalance ? (
                          <FaEyeSlash className="fs-5" />
                        ) : (
                          <FaEye className="fs-5" />
                        )}
                      </Button>
                    </p>
                    <Link
                      to="/dashboard/fund-wallet"
                      className="btn btn-danger"
                      id="fund-wallet"
                    >
                      Fund Wallet <IoAddCircleSharp className="fs-5" />
                    </Link>
                  </>
                )}
              </div>
              <div className="earning-bonus">
                <h5 className="text-light">Referral Bonus</h5>
                <h3 className="">₦{parseFloat("0").toLocaleString()} </h3>
              </div>
              <div className="total-referral">
                <h5 className="text-light">Total Referral</h5>
                <h3 className="">0</h3>
              </div>
            </div>
          </section>

          <div className="container py-5">
            <h2>Payment & Services</h2>
            <div className="row justify-content-center align-items-center py-4">
              <div className="col-lg-6 col-sm-8 my-4">
                <div className="card shadow-sm p-3" id="card-data">
                  <div className="card-img-top text-center">
                    <CgData className="text-danger fs-1" />
                  </div>
                  <div className="card-body text-center">
                    <h2 className="card-title">Buy Data</h2>
                    <p className="card-text fs-4">
                      Get your data bundles across any network with just a few
                      clicks.
                    </p>
                    <Link
                      to="/dashboard/data"
                      className="btn btn-danger btn-animate"
                    >
                      <span className="fw-bold">PURCHASE DATA</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-sm-8 my-4">
                <div className="card shadow-sm p-3" id="card-airtime">
                  <div className="card-img-top text-center">
                    <LuPhoneCall className="text-danger fs-1" />
                  </div>

                  <div className="card-body text-center">
                    <h2 className="card-title">Buy Airtime</h2>
                    <p className="card-text fs-4">
                      Recharge your airtime with any amount on any network
                      instantly.
                    </p>
                    <Link
                      to="/dashboard/airtime"
                      className="btn btn-danger btn-animate"
                    >
                      <span className="fw-bold"> PURCHASE AIRTIME </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* <div className="col-lg-4 col-md-6 col-sm-8 my-4">
                <div className="card shadow-sm p-3" id="card-airtime">
                  <div className="card-img-top text-center">
                    <FaRegLightbulb className="text-danger fs-1" />
                  </div>

                  <div className="card-body text-center">
                    <h2 className="card-title">Electricity Bills</h2>
                    <p className="card-text fs-4">
                      Power your home seamlessly - pay electricity bills
                      instantly, 24/7.
                    </p>
                    <button
                      className="btn btn-danger btn-animate"
                      onClick={handleBills}
                    >
                      <span className="fw-bold">PAY BILLS</span>
                    </button>
                  </div>
                </div>
              </div> */}

              {/* <div className="col-lg-4 col-md-6 col-sm-8 my-4">
                <div className="card shadow-sm p-3" id="card-airtime">
                  <div className="card-img-top text-center">
                    <HiMiniTv className="text-danger fs-1" />
                  </div>

                  <div className="card-body text-center">
                    <h2 className="card-title">Cable Payments</h2>
                    <p className="card-text fs-4">
                      Never miss your favorite shows - quick and easy TV
                      subscription renewals.
                    </p>
                    <button
                      className="btn btn-danger btn-animate"
                      onClick={handleBills}
                    >
                      <span className="fw-bold">PAY CABLE PAYMENTS</span>
                    </button>
                  </div>
                </div>
              </div> */}

              <div className="col-lg-6 col-sm-8 my-4">
                <div className="card shadow-sm p-3" id="card-airtime">
                  <div className="card-img-top text-center">
                    <BsPeopleFill className="text-danger fs-1" />
                  </div>

                  <div className="card-body text-center">
                    <h2 className="card-title">My Referrals</h2>
                    <p className="card-text fs-4">
                      Share, invite, and earn - get rewarded for growing our
                      community.
                    </p>
                    <button
                      className="btn btn-danger btn-animate"
                      onClick={handleBills}
                    >
                      <span className="fw-bold">REFERRALS</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-8 my-4">
                <div className="card shadow-sm p-3" id="card-airtime">
                  <div className="card-img-top text-center">
                    <FaMoneyBillTrendUp className="text-danger fs-1" />
                  </div>

                  <div className="card-body text-center">
                    <h2 className="card-title">Bonus To Wallet</h2>
                    <p className="card-text fs-4">
                      Turn your loyalty into cash - collect and use bonuses
                      directly in your wallet.
                    </p>
                    <button
                      className="btn btn-danger btn-animate"
                      onClick={handleBills}
                    >
                      <span className="fw-bold">BONUS TO WALLET</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* End list of items */}
            </div>
          </div>
          <section>
            <TransactionHistory />
          </section>

          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{modalMessage.title} </Modal.Title>
            </Modal.Header>
            <Modal.Body> {modalMessage.message} </Modal.Body>
            <Modal.Footer>
              <Button
                variant={modalMessage.variant}
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ServiceCards;

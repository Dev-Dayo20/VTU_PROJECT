import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Our/Services.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../SIdebar/SIdebar";
import Footer from "../Footer/Footer";
import CustomLoading from "../CustomLoading/CustomLoading";
import axios from "axios";
import { CgData } from "react-icons/cg";
import { LuPhoneCall } from "react-icons/lu";
import { FaRegLightbulb } from "react-icons/fa";

const ServiceCards = () => {
  const [userdata, setUserData] = useState({
    username: "",
    wallet: 0.0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
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
            className="wallet bg-dark text-light p-5"
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
                        ₦{parseFloat(userdata.wallet).toLocaleString()}
                      </span>
                    </p>
                    <Link
                      to="/dashboard/fund-wallet"
                      className="btn btn-danger"
                    >
                      Fund Wallet +
                    </Link>
                  </>
                )}
              </div>
              <div className="earning-bonus">
                <h4 className="text-danger">Earning Balance</h4>
                <h2 className="">100</h2>
              </div>
              <div className="total-referral">
                <h4 className="text-danger">Total Referral</h4>
                <h2 className="">50</h2>
              </div>
            </div>
          </section>

          <div className="container py-5">
            <div className="row justify-content-center align-items-center py-4">
              <div className="col-lg-4 col-md-6 col-sm-8 my-4">
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
                      Purchase Data
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-8 my-4">
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
                      Purchase Airtime
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-8 my-4">
                <div className="card shadow-sm p-3" id="card-airtime">
                  <div className="card-img-top text-center">
                    <FaRegLightbulb className="text-danger fs-1" />
                  </div>

                  <div className="card-body text-center">
                    <h2 className="card-title">Electricity Bills</h2>
                    <p className="card-text fs-4">
                      Recharge your airtime with any amount on any network
                      instantly.
                    </p>
                    <Link
                      to="/dashboard/billspayment"
                      className="btn btn-danger btn-animate"
                    >
                      Purchase Airtime
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default ServiceCards;

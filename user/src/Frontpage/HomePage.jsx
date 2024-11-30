import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Frontpage/HomePage.css";
import airtime3 from "../assets/airtime3.jpg";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import devdlogo from "../assets/devdlogo.png";
import mockup from "../assets/mockup.png";
import { MdContactSupport } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";

const HomePage = () => {
  const navigate = useNavigate();

  const handleButtonClick = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <Header />
      <main className="container">
        <section className="hero py-5 ">
          <div className="row align-items-center mt-5">
            <div className="col-md-6 mt-1">
              <div className="logo-block d-flex align-items-center flex-wrap">
                <img src={devdlogo} alt="" style={{ width: "20%" }} />
                <div className="brand-title">
                  <h2 className="fw-bold text-danger">Dev.D Plug</h2>
                </div>
              </div>
              <h1 className="fs-1 fw-bold">Buy Your Data Effortlessly</h1>
              <p className="fs-4">
                Get data or airtime with just a few clicks. Simple, fast, and
                secure.
              </p>
              <button
                onClick={handleButtonClick}
                className="btn btn-outline-danger fw-medium"
              >
                Get Started
              </button>
              <h2 className="mt-4 fs-1 fw-bold">
                Buy Your Airtime Effortlessly
              </h2>
              <p className="fs-4">
                Get data or airtime with just a few clicks. Simple, fast, and
                secure.
              </p>
              <button onClick={handleButtonClick} className="btn btn-danger">
                Learn More
              </button>
            </div>
            <div className="col-md-6 mt-4">
              <img src={airtime3} alt="" style={{ width: "100%" }} />
            </div>
          </div>
        </section>

        <section className=" hero">
          <div className="row align-items-center my-1">
            <div className="col-6 mt-4">
              <div className="">
                <img src={mockup} alt="" style={{ width: "100%" }} />
              </div>
            </div>
            <div className="col-md-6 mt-4">
              <div>
                <h3 className="lead display-6 fw-medium">Why Choose Us?</h3>
                <p className="fs-4">
                  Fast delivery of data and airtime to any network in Nigeria.
                </p>
              </div>
              <Link
                to="/login"
                className="btn btn-outline-danger fs-5 mb-4 fw-medium"
              >
                Sign in
              </Link>
              <div>
                <h3 className="lead display-6 fw-medium">Easy Payment</h3>
                <p className="fs-4">
                  Pay with any method, including bank transfers and credit
                  cards.
                </p>
              </div>
              <Link to="/register" className="btn btn-danger fs-5">
                Sign up
              </Link>
            </div>
          </div>
        </section>

        <section>
          <div className="d-flex justify-content-center">
            <p className="display-5 fw-bold ">
              Make All Your Payment{" "}
              <span className="text-danger">Digitally.</span>
            </p>
          </div>
          <div className="row my-5">
            <div className="col-md-6">
              <div className="card shadow-md">
                <div className="card-img-top text-center">
                  <MdContactSupport className="fs-1 text-danger" />
                </div>
                <div className="card-body text-center">
                  <div className="card-title">
                    <h3 className="text-danger">Customer Support</h3>
                  </div>
                  <div className="card-text">
                    <p className="fs-5">
                      24/7 customer care to help cater for any of your concerns
                      while using our services
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-md">
                <div className="card-img-top text-center">
                  <RiSecurePaymentLine className="fs-1 text-danger" />
                </div>
                <div className="card-body text-center">
                  <div className="card-title">
                    <h3 className="text-danger">Bill Payment</h3>
                  </div>
                  <div className="card-text">
                    <p className="fs-5">
                      Seamless bill payment available form anywhere, anytime and
                      within just few clicks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row my-5">
            <div className="col-md-6">
              <div className="card shadow-md">
                <div className="card-img-top text-center">
                  <MdOutlinePrivacyTip className="fs-1 text-danger" />
                </div>
                <div className="card-body text-center">
                  <div className="card-title">
                    <h3 className="text-danger">Privacy Policy</h3>
                  </div>
                  <div className="card-text">
                    <p className="fs-5">
                      24/7 customer care to help cater for any of your concerns
                      while using our services
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-md">
                <div className="card-img-top text-center">
                  <RiSecurePaymentFill className="fs-1 text-danger" />
                </div>
                <div className="card-body text-center">
                  <div className="card-title">
                    <h3 className="text-danger">Secured Access</h3>
                  </div>
                  <div className="card-text">
                    <p className="fs-5">
                      24/7 customer care to help cater for any of your concerns
                      while using our services
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;

import React from "react";
import devdlogo from "../assets/devdlogo.png";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row align-items-center gap-5">
          {/* Company Description and Logo */}
          <div className="col-md-4">
            <div className="d-flex align-items-center">
              <img
                src={devdlogo}
                alt="Company Logo"
                className="mb-1"
                style={{ width: "90px" }}
              />
              <div className="brand-title">
                <h3>Dev.D Plug</h3>
              </div>
            </div>
            <p>
              <span className="text-danger">
                {" "}
                <strong>Dev.D Plug</strong>
              </span>{" "}
              is a dynamic platform for seamless data and airtime reselling,
              with a bold vision to revolutionize e-payments. We provide a
              reliable gateway for quick mobile top-ups, bill payments, and
              online course transactions.
              {/* As we expand, we are set to introduce
              cutting-edge features like blockchain integration, ensuring a
              future-proof, secure, and innovative digital experience for our
              users. */}
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2">
            <h4 className="text-danger">Quick Links</h4>
            <ul className="list-unstyled">
              <li className="my-3">
                <a href="#" className="text-light text-decoration-none">
                  About Us
                </a>
              </li>
              <li className="my-3">
                <a href="/login" className="text-light text-decoration-none">
                  Services
                </a>
              </li>
              <li className="my-3">
                <a href="#" className="text-light text-decoration-none">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-md-2">
            <h4 className="text-danger">Legal</h4>
            <ul className="list-unstyled">
              <li className="my-3">
                <a href="/contact" className="text-light text-decoration-none">
                  Contact Us
                </a>
              </li>
              <li className="my-3">
                <a
                  href="/privacy-policy"
                  className="text-light text-decoration-none"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="my-3">
                <a
                  href="/terms-conditions"
                  className="text-light text-decoration-none"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="col-md-2">
            <h4 className="text-danger">Stay in Touch</h4>
            <ul className="list-unstyled">
              <li className="my-3">
                <a
                  href="https://linkedin.com"
                  className="text-light text-decoration-none"
                >
                  LinkedIn
                </a>
              </li>
              <li className="my-3">
                <a
                  href="https://instagram.com"
                  className="text-light text-decoration-none"
                >
                  Instagram
                </a>
              </li>
              <li className="my-3">
                <a
                  href="https://twitter.com"
                  className="text-light text-decoration-none"
                >
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4">
          <p className="mb-0">&copy; 2024 Dev.D Plug. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { IoMdHome } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { CiSettings } from "react-icons/ci";
import { IoWallet } from "react-icons/io5";
import { MdPriceChange } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);

  const toggleSidebar = () => {
    if (!isLargeScreen) {
      setIsOpen(!isOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
      if (window.innerWidth > 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!isLargeScreen && (
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isOpen ? <IoMdClose /> : <GiHamburgerMenu />}
        </button>
      )}

      <div className={`sidebar bg-dark ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Dashboard</h2>
        <ul>
          <li className="">
            <Link to="/dashboard">
              <IoMdHome className="fs-4 mx-2" />
              Home
            </Link>
          </li>
          <li>
            <Link to="#">
              <CgProfile className="fs-4 mx-2" />
              Profile
            </Link>
          </li>

          <li>
            <Link to="/dashboard/fund-wallet">
              <IoWallet className="fs-4 mx-2" />
              Fund Wallet
            </Link>
          </li>
          <li>
            <Link to="#">
              <MdPriceChange className="fs-4 mx-2" />
              Pricing
            </Link>
          </li>
          <li>
            <Link to="#">
              <CiSettings className="fs-4 mx-2" />
              Settings
            </Link>
          </li>
          <li>
            <Link to="#">
              <RiLockPasswordLine className="fs-4 mx-2" />
              Change Pin
            </Link>
          </li>
          <li>
            <Link className="text-danger" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;

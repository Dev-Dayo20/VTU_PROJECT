import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Sidebar/Sidebar.css";
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
    navigate("/");
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
        <h4 className="sidebar-title">Admin</h4>
        <ul>
          <li className="">
            <Link to="/dashboard" className="d-flex align-items-center">
              <IoMdHome className="fs-4 mx-2" />
              <span className="fs-6">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/manage-user" className="d-flex align-items-center">
              <CgProfile className="fs-4 mx-2" />
              <span className="fs-6">Manage User</span>
            </Link>
          </li>

          <li>
            <Link
              to="/dashboard/fund-wallet"
              className="d-flex align-items-center"
            >
              <IoWallet className="fs-4 mx-2" />
              <span className="fs-6"> Manage Transactions</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="d-flex align-items-center">
              <MdPriceChange className="fs-4 mx-2" />
              <span className="fs-6">Reports</span>
            </Link>
          </li>

          <li>
            <Link to="#" className="d-flex align-items-center">
              <RiLockPasswordLine className="fs-4 mx-2" />
              <span className="fs-6">Notifications & Logs</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="d-flex align-items-center">
              <CiSettings className="fs-4 mx-2" />
              <span className="fs-6">System Settings</span>
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

import "../Dashboard/Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Home from "./Home/Home";
const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <Home />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

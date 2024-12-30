import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./components/Forms/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import ViewUser from "./components/Manage User/ViewUser";
import AuthProvider from "./Utils/AuthProvider";
import AddUser from "./components/Forms/Add User/AddUser";
import UserDetails from "./components/Manage User/UserDetails";
import ManagaTelecomms from "./components/Mange Telecoms/ManagaTelecomms";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route
            index
            path="/"
            element={
              <ProtectedRoutes>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard />
                </motion.div>
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/login"
            element={
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/admin/manage-user"
            element={
              <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ViewUser />
              </motion.div>
            }
          />
          <Route
            path="/admin/newuser"
            element={
              <motion.div>
                <AddUser />
              </motion.div>
            }
          />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/telecoms" element={<ManagaTelecomms />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

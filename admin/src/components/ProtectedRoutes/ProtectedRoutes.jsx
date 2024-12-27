import { Navigate } from "react-router-dom";

// ProtectedRoute component to handle authentication logic
const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoutes;

import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute component to handle authentication logic
const ProtectedRoutes = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;

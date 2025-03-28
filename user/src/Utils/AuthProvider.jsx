import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          logout();
          return;
        }
        setUser({
          isAuthenticated: true,
          email: decodedToken.email,
          id: decodedToken.id,
        });
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    } else {
      setUser(null);
    }
  };
  // Login method
  const login = (token) => {
    localStorage.setItem("token", token);
    checkAuth();
  };

  // Logout method
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  // Check auth on initial mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Value to be provided to consumers
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.isAuthenticated,
  };
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;

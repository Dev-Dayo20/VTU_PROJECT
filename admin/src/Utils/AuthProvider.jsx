import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (
          decodedToken.exp * 1000 < Date.now() ||
          decodedToken.role !== "admin"
        ) {
          logout();
          return;
        }

        setAdmin({
          isAuthenticated: true,
          role: decodedToken.role,
          email: decodedToken.email,
          id: decodedToken.id,
        });
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    } else {
      setAdmin(null);
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
    setAdmin(null);
  };

  // Check auth on initial mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Value to be provided to consumers
  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin?.isAuthenticated,
  };
  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;

import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

// Create the context that components will consume
const AuthContext = createContext(null);

// Create the Provider component that will wrap your app
export function AuthProvider({ children }) {
  // Initialize the authentication state by checking localStorage on initial load
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return false; // Not authenticated if no token exists
    }

    try {
      // Decode the token to check its expiration date
      const decoded = jwtDecode(token);
      // The 'exp' claim is in seconds, Date.now() is in milliseconds
      return decoded.exp * 1000 > Date.now();
    } catch (error) {
      console.error("Invalid token found in localStorage:", error);
      return false; // Treat as not authenticated if token is malformed
    }
  });

  // Function to call upon successful login
  const login = (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setIsAuthenticated(true);
  };

  // Function to call for logging out
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  };

  // The value that will be provided to all consuming components
  const authContextValue = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook for easy access to the auth context
export function useAuth() {
  return useContext(AuthContext);
}

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Note the import style

function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Check if the token is expired
    if (decodedToken.exp < currentTime) {
      console.warn("Access token expired.");
      // Here you could also trigger a token refresh if you have a refresh token
      localStorage.removeItem("accessToken"); // Clean up expired token
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Invalid token:", error);
    // If token is malformed, treat as unauthenticated
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

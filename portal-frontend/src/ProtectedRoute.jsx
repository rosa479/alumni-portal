import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/**
 * A component that protects routes from unauthenticated access.
 * It uses the global AuthContext to check the user's login status.
 */
function ProtectedRoute() {
  // 2. Get the authentication status from the global context.
  //    This is a simple boolean: true or false.
  const { isAuthenticated } = useAuth();

  // 3. Check the status.
  //    If the user is authenticated, render the <Outlet />.
  //    The <Outlet /> acts as a placeholder where React Router will render
  //    the matched child route (e.g., the Dashboard, Profile page, etc.).
  if (isAuthenticated) {
    return <Outlet />;
  }

  // 4. If the user is NOT authenticated, redirect them to the /login page.
  //    The 'replace' prop is a good practice as it prevents the user from
  //    clicking the browser's "back" button to get back to the page
  //    they were just redirected from.
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;

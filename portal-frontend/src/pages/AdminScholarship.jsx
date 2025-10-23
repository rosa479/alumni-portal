import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

// AdminScholarship now acts as an admin layout. Child admin routes
// should be declared in the application's central router (e.g. App.jsx).
export default function AdminScholarship() {
  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#F5F8FA]">
        <div className="max-w-7xl mx-auto p-6">
          {/* Admin content will be rendered here via nested routes */}
          <Outlet />
        </div>
      </div>
    </>
  );
}

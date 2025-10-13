// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-3xl font-bold text-[#0077B5]">
          AlumnIIT
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-gray-800 font-medium hover:text-orange-600 transition-colors">
            Dashboard
          </Link>
          <Link to="/communities" className="text-gray-800 font-medium hover:text-orange-600 transition-colors">
            Communities
          </Link>
          <Link to="/profile" className="text-gray-800 font-medium hover:text-orange-600 transition-colors">
            Profile
          </Link>
          <Link to="/donate" className="text-gray-800 font-medium hover:text-orange-600 transition-colors">
            Donate
          </Link>
          <Link to="/endowment" className="text-gray-800 font-medium hover:text-orange-600 transition-colors">
            Endowment
          </Link>

          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold border border-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
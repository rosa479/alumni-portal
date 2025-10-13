// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "react-feather"; // Optional: for an icon
import { useAuth } from "../context/AuthContext";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold text-blue-800">
          IITKGP Connect
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard"
            className="text-gray-800 font-medium hover:text-orange-600 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/communities"
            className="text-gray-800 font-medium hover:text-orange-600 transition-colors"
          >
            Communities
          </Link>
          <Link
            to="/profile"
            className="text-gray-800 font-medium hover:text-orange-600 transition-colors"
          >
            Profile
          </Link>
          <Link
            to="/donate"
            className="text-gray-800 font-medium hover:text-orange-600 transition-colors"
          >
            Donate
          </Link>
          <Link
            to="/contributions"
            className="text-gray-800 font-medium hover:text-orange-600 transition-colors"
          >
            Contributions
          </Link>

          {/* 1. Desktop Logout Button Added */}
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold border border-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
          >
            Logout
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-800" />
          ) : (
            <Menu className="w-6 h-6 text-gray-800" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-gray-800 font-medium hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Dashboard
            </Link>
            <Link
              to="/communities"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-gray-800 font-medium hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Communities
            </Link>
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-gray-800 font-medium hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Profile
            </Link>
            <Link
              to="/donate"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-gray-800 font-medium hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Donate
            </Link>
            <Link
              to="/contributions"
              onClick={closeMobileMenu}
              className="block py-3 px-4 text-gray-800 font-medium hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              Contributions
            </Link>

            {/* 2. Mobile Logout Button Added */}
            <hr className="my-2 border-gray-200" />
            <button
              onClick={handleLogout}
              className="block w-full text-left py-3 px-4 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;

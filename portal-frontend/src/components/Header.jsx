// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "react-feather"; // Removed LogOut as it's not used visually

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

  const navLinkClass =
    "relative text-gray-800 font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0077B5] after:scale-x-0 after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100";
  const mobileNavLinkClass =
    "block py-3 px-4 text-gray-800 font-medium hover:text-[#0077B5] hover:bg-gray-50 rounded-lg transition-colors duration-200";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-3xl font-bold text-[#0077B5]">
          AlumnIIT
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className={navLinkClass}>
            Dashboard
          </Link>
          <Link to="/communities" className={navLinkClass}>
            Communities
          </Link>
          <Link to="/profile" className={navLinkClass}>
            Profile
          </Link>
          <Link to="/donate" className={navLinkClass}>
            Donate
          </Link>
          <Link to="/contributions" className={navLinkClass}>
            Contributions
          </Link>

          {/* Desktop Logout Button */}
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
            <Link to="/dashboard" onClick={closeMobileMenu} className={mobileNavLinkClass}>
              Dashboard
            </Link>
            <Link to="/communities" onClick={closeMobileMenu} className={mobileNavLinkClass}>
              Communities
            </Link>
            <Link to="/profile" onClick={closeMobileMenu} className={mobileNavLinkClass}>
              Profile
            </Link>
            <Link to="/donate" onClick={closeMobileMenu} className={mobileNavLinkClass}>
              Donate
            </Link>
            <Link
              to="/contributions"
              onClick={closeMobileMenu}
              className={mobileNavLinkClass}
            >
              Contributions
            </Link>

            {/* Mobile Logout Button */}
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
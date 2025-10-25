// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../interceptor";

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get("/profiles/me/");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/dashboard" className="text-3xl font-bold text-[#0077B5]">
          kgpACT
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="relative text-gray-800 font-medium py-2 px-1 rounded-md transition-colors group"
          >
            Dashboard
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[hsl(197,71%,73%)] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/communities"
            className="relative text-gray-800 font-medium py-2 px-1 rounded-md transition-colors group"
          >
            Communities
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[hsl(197,71%,73%)] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {/* <Link
            to="/profile"
            className="relative text-gray-800 font-medium py-2 px-1 rounded-md transition-colors group"
          >
            Profile
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[hsl(197,71%,73%)] transition-all duration-300 group-hover:w-full"></span>
          </Link> */}
          <Link
            to="/donate"
            className="relative text-gray-800 font-medium py-2 px-1 rounded-md transition-colors group"
          >
            Donate
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[hsl(197,71%,73%)] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            to="/endowment"
            className="relative text-gray-800 font-medium py-2 px-1 rounded-md transition-colors group"
          >
            Endowment
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[hsl(197,71%,73%)] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Profile Picture Dropdown (PFC) */}
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-colors focus:outline-none"
              onClick={() => setShowDropdown((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              <img
                src={
                  user?.alumni_profile?.profile_picture_url ||
                  `https://i.pravatar.cc/150?u=${user?.id || "default"}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://i.pravatar.cc/150?u=${
                    user?.id || "default"
                  }`;
                }}
              />
            </button>
            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-70 bg-white border border-gray-200 rounded-lg shadow-lg py-4 px-4 z-50">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={
                      user?.alumni_profile?.profile_picture_url ||
                      `https://i.pravatar.cc/150?u=${user?.id || "default"}`
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-blue-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user?.alumni_profile?.full_name ||
                        user?.full_name ||
                        "User"}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <Link
                  to="/admin-panel"
                  className={
                    user?.role === "ALUMNI"
                      ? "block w-full text-left px-4 py-2 mb-2 rounded-md text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                      : "hidden"
                  }
                  onClick={() => setShowDropdown(false)}
                >
                  Scholarships
                </Link>
                <Link
                  to="/accounts"
                  className={
                    user?.role === "ACCOUNTS"
                      ? "block w-full text-left px-4 py-2 mb-2 rounded-md text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                      : "hidden"
                  }
                  onClick={() => setShowDropdown(false)}
                >
                  Accounts Panel
                </Link>
                <Link
                  to="/profile"
                  className="block w-full text-left px-4 py-2 mb-2 rounded-md text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 rounded-md text-red-600 font-medium border border-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <nav className="flex md:hidden items-center space-x-3">
          {/* Profile Picture Dropdown (PFC) */}
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-colors focus:outline-none"
              onClick={() => setShowDropdown((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={showDropdown}
            >
              <img
                src={
                  user?.alumni_profile?.profile_picture_url ||
                  `https://i.pravatar.cc/150?u=${user?.id || "default"}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://i.pravatar.cc/150?u=${
                    user?.id || "default"
                  }`;
                }}
              />
            </button>
            {/* Dropdown menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-70 bg-white border border-gray-200 rounded-lg shadow-lg py-4 px-4 z-50">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={
                      user?.alumni_profile?.profile_picture_url ||
                      `https://i.pravatar.cc/150?u=${user?.id || "default"}`
                    }
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border border-blue-600"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user?.alumni_profile?.full_name ||
                        user?.full_name ||
                        "User"}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="block w-full text-left px-4 py-2 mb-2 rounded-md text-blue-600 font-medium hover:bg-blue-50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 rounded-md text-red-600 font-medium border border-red-500 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;

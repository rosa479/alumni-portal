// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../interceptor";

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

        {/* Mobile Profile Icon */}
        <div className="md:hidden">
          <Link to="/profile" className="block">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-colors">
              <img
                src={
                  user?.alumni_profile?.profile_picture_url || 
                  `https://i.pravatar.cc/150?u=${user?.id || 'default'}`
                }
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.src = `https://i.pravatar.cc/150?u=${user?.id || 'default'}`;
                }}
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
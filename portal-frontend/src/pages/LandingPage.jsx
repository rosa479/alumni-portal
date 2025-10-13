import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Our Community
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Connect, share, and grow with like-minded people.
        </p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

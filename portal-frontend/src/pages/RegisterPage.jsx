// src/features/auth/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../interceptor";
import Input from "../components/Input"; // Adjust path if needed
import Button from "../components/Button"; // Adjust path if needed

function RegisterPage() {
  // 1. State for each form input
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState(""); // Added roll number field
  const [gradYear, setGradYear] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  // 2. State for handling submission status and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isOAuthUser, setIsOAuthUser] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Handle email pre-filling from login flow or OAuth
  useEffect(() => {
    // Handle OAuth data
    if (location.state?.oauthData) {
      const { oauthData, isExistingUser: existing } = location.state;
      
      setEmail(oauthData.email || "");
      setFullName(oauthData.name || oauthData.full_name || "");
      setIsOAuthUser(true); // Mark as OAuth user
      
      if (existing) {
        // Existing user from OAuth - pre-fill other data
        setRollNumber(oauthData.roll_number || "");
        setGradYear(oauthData.graduation_year?.toString() || "");
        setDepartment(oauthData.department || "");
        setIsExistingUser(true);
      }
    }
    // Handle email-first flow
    else if (location.state?.email) {
      const { email: preEmail, isNewUser } = location.state;
      setEmail(preEmail);
      
      if (!isNewUser) {
        // User exists but came from email flow - fetch user data
        fetchUserData(preEmail);
      }
    }
  }, [location.state]);

  const fetchUserData = async (email) => {
    try {
      const response = await apiClient.get(`/auth/check-user/?email=${encodeURIComponent(email)}`);
      if (response.data.exists) {
        const user = response.data.user;
        setFullName(user.full_name || "");
        setRollNumber(user.roll_number || "");
        setGradYear(user.graduation_year?.toString() || "");
        setDepartment(user.department || "");
        setIsExistingUser(true);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission (page reload)
    setIsSubmitting(true);
    setError(null);

    // 4. Construct the data payload matching the serializer
    const userData = {
      full_name: fullName,
      email: email,
      roll_number: rollNumber,
      graduation_year: gradYear,
      department: department,
      password: password,
    };

    try {
      let response;
      
      if (isExistingUser) {
        // Existing user activation
        response = await apiClient.post("/auth/activate-user/", {
          email: email,
          ...userData
        });
      } else {
        // New user registration
        response = await apiClient.post("/auth/register/", userData);
      }

      // Login directly with the tokens from backend
      if (response.data.access && response.data.refresh) {
        login(response.data.access, response.data.refresh);
        navigate("/dashboard");
      } else {
        // Fallback (shouldn't happen with updated backend)
        navigate("/login?status=success");
      }
    } catch (err) {
      // 7. Handle errors from the server
      console.error(
        "Registration failed:",
        err.response ? err.response.data : err.message
      );
      if (err.response && err.response.data) {
        // Concatenate all validation errors from the backend for display
        const errorMessages = Object.values(err.response.data).flat().join(" ");
        setError(
          errorMessages || "Registration failed. Please check your details."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F8FA] via-[#E3F0FB] to-[#B3D6F2]">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-2xl border border-[#E3EAF3] text-center">
        <h2 className="text-3xl font-bold text-[#0077B5] mb-2">
          {isExistingUser ? 'Complete Your Registration' : 'Create Your Account'}
        </h2>
        {location.state?.oauthData && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-left mb-4">
            <p className="font-semibold">✓ Google Authentication Successful!</p>
            <p>Please complete your registration details below.</p>
          </div>
        )}
        {isExistingUser && !location.state?.oauthData && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm text-left">
            <p className="font-semibold">Account Found!</p>
            <p>Your account exists. Please complete the form below to activate your account.</p>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 9. Display an error message if one exists */}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-left"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* 10. Inputs are now controlled components (value + onChange) */}
          <Input
            id="fullName"
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isExistingUser || isOAuthUser}
            className={`bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg ${(isExistingUser || isOAuthUser) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          <Input
            id="rollNumber"
            label="Roll Number"
            placeholder="20CS10001"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
          />
          <Input
            id="gradYear"
            label="Graduation Year"
            type="number"
            placeholder="2018"
            value={gradYear}
            onChange={(e) => setGradYear(e.target.value)}
            required
          />
          <Input
            id="department"
            label="Department"
            placeholder="Computer Science"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0077B5] text-white rounded-lg hover:bg-[#005983] transition-colors font-semibold"
          >
            {isSubmitting 
              ? (isExistingUser ? "Activating Account..." : "Creating Account...")
              : (isExistingUser ? "Activate Account" : "Create Account")
            }
          </Button>
        </form>
        <p className="text-sm text-light-text">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-iit-blue hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
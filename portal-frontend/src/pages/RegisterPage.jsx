// src/features/auth/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../interceptor";
import {
  Handshake,
  Users,
  Network,
  Sparkles,
  GraduationCap,
  Star,
  Briefcase,
  Globe,
} from "lucide-react";

// --- Reusable Components ---
const Input = ({
  id,
  label,
  value,
  onChange,
  type,
  placeholder,
  className,
  disabled,
}) => (
  <div className="text-left">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077B5] text-gray-800 ${className} ${
        disabled ? "bg-gray-200 cursor-not-allowed" : "bg-[#F5F8FA]"
      }`}
      required
    />
  </div>
);

const Button = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`w-full py-2 px-4 text-base font-semibold rounded-lg transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

function RegisterPage() {
  // Country codes with flags
  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "United States", flag: "🇺🇸" },
    { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
    { code: "+49", country: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "France", flag: "🇫🇷" },
    { code: "+81", country: "Japan", flag: "🇯🇵" },
    { code: "+86", country: "China", flag: "🇨🇳" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+55", country: "Brazil", flag: "🇧🇷" },
    { code: "+7", country: "Russia", flag: "🇷🇺" },
    { code: "+39", country: "Italy", flag: "🇮🇹" },
    { code: "+34", country: "Spain", flag: "🇪🇸" },
    { code: "+31", country: "Netherlands", flag: "🇳🇱" },
    { code: "+46", country: "Sweden", flag: "🇸🇪" },
    { code: "+47", country: "Norway", flag: "🇳🇴" },
    { code: "+45", country: "Denmark", flag: "🇩🇰" },
    { code: "+41", country: "Switzerland", flag: "🇨🇭" },
    { code: "+43", country: "Austria", flag: "🇦🇹" },
    { code: "+32", country: "Belgium", flag: "🇧🇪" },
    { code: "+351", country: "Portugal", flag: "🇵🇹" },
    { code: "+30", country: "Greece", flag: "🇬🇷" },
    { code: "+48", country: "Poland", flag: "🇵🇱" },
    { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
    { code: "+36", country: "Hungary", flag: "🇭🇺" },
    { code: "+40", country: "Romania", flag: "🇷🇴" },
    { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
    { code: "+385", country: "Croatia", flag: "🇭🇷" },
    { code: "+386", country: "Slovenia", flag: "🇸🇮" },
    { code: "+421", country: "Slovakia", flag: "🇸🇰" },
    { code: "+370", country: "Lithuania", flag: "🇱🇹" },
    { code: "+371", country: "Latvia", flag: "🇱🇻" },
    { code: "+372", country: "Estonia", flag: "🇪🇪" },
    { code: "+358", country: "Finland", flag: "🇫🇮" },
    { code: "+353", country: "Ireland", flag: "🇮🇪" },
    { code: "+354", country: "Iceland", flag: "🇮🇸" },
  ];

  // 1. State for each form input
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState(""); // Added roll number field
  const [gradYear, setGradYear] = useState("");
  const [department, setDepartment] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
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
        // Existing PENDING user - prioritize existing alumni_profile data
        const profile = oauthData.alumni_profile || {};

        console.log("Existing user detected. OAuth data:", oauthData);
        console.log("Alumni profile:", profile);

        // Use existing data from alumni_profile, fallback to Google OAuth data
        setFullName(profile.full_name || oauthData.name || "");
        setRollNumber(oauthData.roll_number || "");
        setGradYear(oauthData.graduation_year?.toString() || "");
        setDepartment(oauthData.department || "");
        setMobileNumber(oauthData.mobile_number || "");
        setIsExistingUser(true);

        console.log("Pre-filled values:", {
          fullName: profile.full_name || oauthData.name,
          rollNumber: oauthData.roll_number,
          gradYear: profile.graduation_year,
          department: profile.department,
          mobileNumber: profile.mobile_number,
        });
      } else {
        // New user - use Google OAuth data
        setFullName(oauthData.name || "");
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
      const response = await apiClient.get(
        `/auth/check-user/?email=${encodeURIComponent(email)}`
      );
      if (response.data.exists) {
        const user = response.data.user;
        const profile = user.alumni_profile || {};

        setFullName(profile.full_name || "");
        setRollNumber(user.roll_number || "");
        setGradYear(profile.graduation_year?.toString() || "");
        setDepartment(profile.department || "");
        setMobileNumber(profile.mobile_number || "");
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
      mobile_number: mobileNumber ? `${countryCode}${mobileNumber}` : "",
      password: password,
    };

    // Add Google profile picture if available (for OAuth users)
    if (isOAuthUser && location.state?.oauthData?.picture) {
      userData.google_picture = location.state.oauthData.picture;
    }

    try {
      let response;

      if (isExistingUser) {
        // Existing user activation
        response = await apiClient.post("/auth/activate-user/", {
          email: email,
          ...userData,
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
      {/* Changed max-w-md to max-w-lg to make the box wider */}
      <div className="w-full max-w-xl p-10 space-y-8 bg-white rounded-2xl border border-[#E3EAF3] text-center">
        <h2 className="text-3xl font-bold text-[#0077B5] mb-2">
          {isExistingUser
            ? "Complete Your Registration"
            : "Create Your Account"}
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
            <p>
              Your account exists. Please complete the form below to activate
              your account.
            </p>
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

          {/* Inputs in grid: 2 per row on sm+, stacked on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className={`bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg ${
                isExistingUser || isOAuthUser
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
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

            {/* Mobile Number with Country Code */}
            <div className="text-left">
              <label
                htmlFor="mobile"
                className="block mb-2 text-sm font-medium text-dark-text"
              >
                Mobile Number
              </label>
              <div className="flex w-full max-w-full overflow-hidden">
                {/* Country Code Dropdown */}
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="flex-shrink-0 w-20 px-2 py-3 bg-gray-50 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-blue focus:outline-none transition border-r-0 text-sm"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>

                {/* Mobile Number Input */}
                <input
                  id="mobile"
                  type="tel"
                  placeholder="9876543210"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  maxLength="15"
                  className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary-blue focus:outline-none transition min-w-0"
                />
              </div>
            </div>

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0077B5] text-white rounded-lg hover:bg-[#005983] transition-colors font-semibold"
          >
            {isSubmitting
              ? isExistingUser
                ? "Activating Account..."
                : "Creating Account..."
              : isExistingUser
              ? "Activate Account"
              : "Create Account"}
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

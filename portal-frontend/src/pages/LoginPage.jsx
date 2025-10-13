import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../interceptor";
import { initGoogleAuth } from "../services/oauthService";

// --- Reusable Components ---
const Input = ({ id, label, value, onChange, type, placeholder, className, disabled }) => (
  <div className="text-left">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
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

// --- Login Page ---
function LoginPage() {
  // 3. GET THE `login` FUNCTION FROM THE CONTEXT
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ actual navigation hook

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 → Check email
  const handleEmailCheck = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post("/auth/check-email/", { email });
      setStep("password");
    } catch (err) {
      console.warn("Email not found, going to register");
      navigate(`/register?email=${encodeURIComponent(email)}`); // ✅ direct navigation
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 → Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login/", { email, password });
      const { access, refresh } = response.data;
      login(access, refresh);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed, going to register");
      navigate(`/register?email=${encodeURIComponent(email)}`); // ✅ direct navigation
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F8FA] via-[#E3F0FB] to-[#B3D6F2]">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl border border-[#E3EAF3] shadow-lg text-center space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0077B5] mb-2">Welcome Back!</h2>
          <p className="text-base text-gray-500 mb-6">Sign in to your alumni account</p>
        </div>

        {step === "email" && (
          <form onSubmit={handleEmailCheck} className="space-y-6">
            <Input
              id="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="your.email@example.com"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className={`bg-[#0077B5] text-white hover:bg-[#005983] ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Checking..." : "Continue"}
            </Button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleLogin} className="space-y-6">
            <Input id="email-display" label="Email Address" value={email} type="email" disabled />
            <Input
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className={`bg-[#0077B5] text-white hover:bg-[#005983] ${
                isLoading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        )}

        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-iit-blue hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
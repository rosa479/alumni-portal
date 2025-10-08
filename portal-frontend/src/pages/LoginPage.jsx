import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
// 1. IMPORT THE useAuth HOOK
import { useAuth } from "../context/AuthContext";
// 2. IMPORT YOUR CONFIGURED API CLIENT
import apiClient from "../interceptor";

function LoginPage() {
  // 3. GET THE `login` FUNCTION FROM THE CONTEXT
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 4. USE `apiClient` INSTEAD OF THE RAW `axios`
      const response = await apiClient.post(
        "/api/auth/login/", // The base URL is already in apiClient
        {
          // NOTE: Your previous code used 'username', but your form uses 'email'.
          // Make sure your backend expects 'email' or change this key to 'username'.
          email: email,
          password: password,
        }
      );

      const { access, refresh } = response.data;

      // 5. REMOVE THE OLD localStorage LOGIC
      // localStorage.setItem("accessToken", access); <--- DELETE THIS
      // localStorage.setItem("refreshToken", refresh); <--- DELETE THIS

      // 6. CALL THE `login` FUNCTION FROM THE CONTEXT INSTEAD
      // This single function updates the global state AND stores the tokens.
      login(access, refresh);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // TODO: Add state to show an error message to the user, e.g., "Invalid credentials."
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-iit-blue">Welcome Back!</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="your.email@example.com"
          />
          <Input
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
          <Button>Login</Button>
        </form>
        <p className="text-sm text-light-text">
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

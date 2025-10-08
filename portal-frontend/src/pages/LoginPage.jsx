// src/features/auth/LoginPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your Django token endpoint
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          email: email,
          password: password,
        }
      );

      // On success, Django returns access and refresh tokens
      const { access, refresh } = response.data;

      // Store tokens in localStorage (or HttpOnly cookies for more security)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Redirect user to a protected page, like their dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login errors (e.g., show an error message)
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

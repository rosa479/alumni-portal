// src/features/auth/LoginPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import Input from '../components/Input';
import Button from '../components/Button';

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-iit-blue">
          Welcome Back!
        </h2>
        <form className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          <Button>Login</Button>
        </form>
        <p className="text-sm text-light-text">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-iit-blue hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
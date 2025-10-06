// src/features/auth/RegisterPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-iit-blue">
          Create Your Account
        </h2>
        <form className="space-y-6">
          <Input id="fullName" label="Full Name" placeholder="John Doe" />
          <Input id="email" label="Email Address" type="email" placeholder="your.email@example.com" />
          <Input id="gradYear" label="Graduation Year" type="number" placeholder="2018" />
          <Input id="department" label="Department" placeholder="Computer Science" />
          <Input id="password" label="Password" type="password" placeholder="••••••••" />
          <Button>Create Account</Button>
        </form>
        <p className="text-sm text-light-text">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-iit-blue hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
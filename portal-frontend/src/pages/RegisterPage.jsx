// src/features/auth/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../interceptor";
import Input from "../components/Input";
import Button from "../components/Button";

function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const userData = {
      full_name: fullName,
      email: email,
      roll_number: rollNumber,
      graduation_year: gradYear,
      department: department,
      password: password,
    };

    try {
      const response = await apiClient.post("/auth/register/", userData);
      navigate("/login?status=success");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessages = Object.values(err.response.data).flat().join(" ");
        setError(
          errorMessages || "Registration failed. Please check your details."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F8FA] via-[#E3F0FB] to-[#B3D6F2]">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-2xl border border-[#E3EAF3] text-center">
        <h2 className="text-3xl font-bold text-[#0077B5] mb-2">
          Create Your Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-left"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          <Input
            id="fullName"
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg"
          />
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg"
          />
          <Input
            id="rollNumber"
            label="Roll Number"
            placeholder="20CS10001"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            required
            className="bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg"
          />
          <Input
            id="gradYear"
            label="Graduation Year"
            type="number"
            placeholder="2018"
            value={gradYear}
            onChange={(e) => setGradYear(e.target.value)}
            required
            className="bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg"
          />
          <Input
            id="department"
            label="Department"
            placeholder="Computer Science"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-[#F5F8FA] border border-[#E3EAF3] rounded-lg"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0077B5] text-white rounded-lg hover:bg-[#005983] transition-colors font-semibold"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#0077B5] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

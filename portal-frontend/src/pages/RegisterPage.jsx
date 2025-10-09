// src/features/auth/RegisterPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  // 3. Function to handle form submission
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
      console.log("Submitting registration data:", userData);
      // 5. Send the POST request using your apiClient
      const response = await apiClient.post("/api/auth/register/", userData);
      console.log("registration response:", response.data);

      // 6. On success, navigate to the login page
      navigate("/login?status=success");
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
    <div className="flex items-center justify-center min-h-screen bg-light-bg">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-iit-blue">
          Create Your Account
        </h2>
        {/* 8. The form now uses the handleSubmit function */}
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
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

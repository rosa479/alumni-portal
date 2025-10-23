import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewScholarship() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    description: "",
    eligibility: "",
    deadline: "",
  });

  const [error, setError] = useState("");

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // --- Handle Submit ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.amount || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    // Simulate saving to backend
    alert(`🎉 Scholarship "${formData.name}" created successfully!`);
    navigate("/admin/scholarships"); // redirect to all scholarships page
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-lg p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="text-sm text-[hsl(199,89%,48%)] mb-4 hover:underline"
        >
          ← Back to Admin Panel
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6">Create New Scholarship</h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Scholarship Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scholarship Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Merit Scholarship"
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. ₹20,000"
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Briefly describe the scholarship..."
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]"
            ></textarea>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Eligibility
            </label>
            <textarea
              name="eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. Minimum GPA of 8.0, enrolled in 3rd year, etc."
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]"
            ></textarea>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:border-[hsl(199,89%,48%)] focus:ring-[hsl(199,89%,48%)]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
            >
              Create Scholarship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

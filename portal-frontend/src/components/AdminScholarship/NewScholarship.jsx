import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptor";

export default function NewScholarship() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    target_amount: "",
    description: "",
    eligibility: "",
    image_url: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Handle Input Change ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // --- Handle Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.target_amount || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    // Validate target_amount is a number
    if (isNaN(formData.target_amount) || Number(formData.target_amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Submit to backend
      await axios.post("/scholarships/list/", {
        title: formData.title,
        target_amount: formData.target_amount,
        description: formData.description,
        eligibility: formData.eligibility,
        image_url: formData.image_url || null,
        status: "ACTIVE",
      });

      // Success - navigate to all scholarships page
      alert(`🎉 Scholarship "${formData.title}" created successfully!`);
      navigate("/admin/scholarships");
    } catch (err) {
      console.error("Error creating scholarship:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to create scholarship. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
              Scholarship Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Merit Scholarship"
              className="w-full p-2 border rounded-md focus:outline-none focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="target_amount"
              value={formData.target_amount}
              onChange={handleChange}
              placeholder="e.g. 2000000"
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

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:border-[hsl(199,89%,48%)] focus:ring-[hsl(199,89%,48%)]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[hsl(199,89%,48%)] hover:bg-blue-500"
              }`}
            >
              {loading ? "Creating..." : "Create Scholarship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

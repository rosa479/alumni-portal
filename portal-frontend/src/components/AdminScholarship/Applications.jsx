// src/components/ApplicationsList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptor";

export default function Applications() {
  const navigate = useNavigate();

  // State management
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/scholarships/applications/");

        // Map backend data to frontend format
        const mappedApplications = response.data.map((app) => ({
          id: app.id,
          name: app.name,
          roll: app.roll,
          approved: app.approved === "APPROVED",
          department: app.department,
          scholarship: app.scholarship_title,
          email: app.email,
          status:
            app.approved === "APPROVED"
              ? "Approved"
              : app.approved === "REJECTED"
              ? "Rejected"
              : "Pending",
          gpa: app.gpa,
        }));

        setApplications(mappedApplications);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F8FA] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back to Admin Panel Button */}
        <button
          onClick={() => navigate("/admin")}
          className="text-sm text-[hsl(199,89%,48%)] mb-4 hover:underline"
        >
          ← Back to Admin Panel
        </button>

        <h1 className="text-3xl font-semibold mb-6">
          Scholarship Applications
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="text-gray-600">Loading applications...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Applications Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-lg font-semibold">{app.name}</div>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      app.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">Roll No: {app.roll}</div>
                <div className="text-sm text-gray-600">
                  Department: {app.department}
                </div>
                <div className="text-sm text-blue-600 font-medium mt-1 mb-4">
                  {app.scholarship}
                </div>

                <button
                  onClick={() =>
                    navigate(`/admin/application/${app.id}`, {
                      state: { app },
                    })
                  }
                  className="mt-auto px-3 py-2 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <div className="text-center text-gray-600 mt-10">
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}

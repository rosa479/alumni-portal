import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptor";

export default function PendingApprovals() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending applications from backend
  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "/scholarships/applications/?status=PENDING"
        );

        // Map backend data to frontend format
        const mappedApplications = response.data.map((app) => ({
          id: app.id,
          name: app.name,
          roll: app.roll,
          department: app.department,
          email: app.email,
          gpa: app.gpa,
          income: app.annual_income,
          reason: app.reason,
        }));

        setApplications(mappedApplications);
      } catch (err) {
        console.error("Error fetching pending applications:", err);
        setError(
          "Failed to load pending applications. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApplications();
  }, []);

  // --- JSX ---
  return (
    <div className="min-h-screen bg-[#F5F8FA] p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[hsl(199,89%,48%)] mb-4 hover:underline"
        >
          ← Back to Admin Panel
        </button>

        <h1 className="text-3xl font-semibold mb-6">Pending Approvals</h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="text-gray-600">Loading pending applications...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Applications Grid or Empty State */}
        {!loading &&
          !error &&
          (applications.length === 0 ? (
            <div className="text-gray-600 text-center mt-10">
              ✅ All applications have been reviewed!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-lg font-semibold">{app.name}</div>
                    <div className="text-sm text-gray-600">
                      Roll No: {app.roll}
                    </div>
                    <div className="text-sm text-gray-600">
                      Department: {app.department}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Email: {app.email}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() =>
                        navigate(`/admin/application/${app.id}`, {
                          state: { app },
                        })
                      }
                      className="px-3 py-2 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

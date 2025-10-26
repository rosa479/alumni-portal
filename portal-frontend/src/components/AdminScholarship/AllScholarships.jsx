import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptor";

export default function AllScholarships() {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch scholarships from backend
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "/scholarships/list/?include_inactive=true"
        );

        // Map backend data to frontend format
        const mappedScholarships = response.data.map((scholarship) => ({
          id: scholarship.id,
          name: scholarship.title,
          type: "Scholarship", // Backend doesn't have type field
          description: scholarship.description,
          amount: `₹${parseFloat(scholarship.target_amount).toLocaleString(
            "en-IN"
          )}`,
          corpus: `₹${parseFloat(scholarship.current_amount).toLocaleString(
            "en-IN"
          )}`,
          dateEstablished: new Date(scholarship.created_at).toLocaleDateString(
            "en-GB"
          ),
          active: scholarship.status === "ACTIVE",
          eligibility: scholarship.eligibility,
        }));

        setScholarships(mappedScholarships);
      } catch (err) {
        console.error("Error fetching scholarships:", err);
        setError("Failed to load scholarships. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // --- Handlers ---
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDeactivate = async (id) => {
    try {
      // Update scholarship status to INACTIVE
      await axios.patch(`/scholarships/list/${id}/`, {
        status: "INACTIVE",
      });

      // Update local state
      setScholarships((prev) =>
        prev.map((s) => (s.id === id ? { ...s, active: false } : s))
      );
    } catch (err) {
      console.error("Error deactivating scholarship:", err);
      alert("Failed to deactivate scholarship. Please try again.");
    }
  };

  // --- Helper for short description ---
  const getShortDescription = (text) => {
    const words = text.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : text;
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin")}
          className="text-sm text-[hsl(199,89%,48%)] mb-4 hover:underline"
        >
          ← Back to Admin Panel
        </button>

        {/* Page Header */}
        <h1 className="text-3xl font-semibold mb-6">All Scholarships</h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-10">
            <div className="text-gray-600">Loading scholarships...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Scholarship List */}
        {!loading && !error && (
          <div className="space-y-3">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Summary Row */}
                <div className="flex items-center justify-between px-5 py-3 ">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-medium text-base">{s.name}</h2>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                        {s.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {getShortDescription(s.description)}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleExpand(s.id)}
                    className="px-3 py-1 cursor-pointer text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                  >
                    {expandedId === s.id ? "Hide Details" : "View Details"}
                  </button>
                </div>

                {/* Expanded Section */}
                {expandedId === s.id && (
                  <div className="px-5 py-4 bg-gray-50 text-sm text-gray-700 space-y-3">
                    <p>{s.description}</p>

                    {s.eligibility && (
                      <div>
                        <span className="font-medium text-gray-600">
                          Eligibility:
                        </span>
                        <p className="ml-2 mt-1">{s.eligibility}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>
                        <span className="ml-2">{s.type}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Established:
                        </span>
                        <span className="ml-2">{s.dateEstablished}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Target Amount:
                        </span>
                        <span className="ml-2 text-green-600 font-medium">
                          {s.amount}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          Current Amount:
                        </span>
                        <span className="ml-2 text-blue-600 font-medium">
                          {s.corpus}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <button
                        onClick={() =>
                          navigate(`/endowment/${s.id}?source=scholarships_app`)
                        }
                        className="px-3 py-1.5 rounded bg-blue-50 text-blue-600 border border-blue-300 hover:bg-blue-100 text-sm"
                      >
                        View on Endowments
                      </button>
                      {s.active ? (
                        <button
                          onClick={() => handleDeactivate(s.id)}
                          className="px-3 py-1.5 rounded border text-red-600 border-red-400 hover:bg-red-50 text-sm"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <span className="text-red-500 text-sm italic">
                          Scholarship Deactivated
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scholarships.length === 0 && (
          <div className="text-center text-gray-600 mt-10">
            No scholarships available.
          </div>
        )}
      </div>
    </div>
  );
}

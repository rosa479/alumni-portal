import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AllScholarships() {
  const navigate = useNavigate();

  // --- Dummy Scholarship Data ---
  const [scholarships, setScholarships] = useState([
    {
      id: 1,
      name: "Merit Scholarship",
      description:
        "Awarded to students with outstanding academic performance and consistent academic excellence throughout their course.",
      amount: "₹20,000",
      active: true,
    },
    {
      id: 2,
      name: "Need-Based Aid",
      description:
        "Designed to assist students from economically weaker backgrounds who face financial difficulties in continuing their education.",
      amount: "₹15,000",
      active: true,
    },
    {
      id: 3,
      name: "Research Fellowship",
      description:
        "Provides financial assistance for students engaged in academic research projects under university supervision.",
      amount: "₹25,000",
      active: false,
    },
    {
      id: 4,
      name: "Women in STEM Scholarship",
      description:
        "Encourages and supports female students pursuing degrees in Science, Technology, Engineering, and Mathematics.",
      amount: "₹30,000",
      active: true,
    },
    {
      id: 5,
      name: "Sports Excellence Award",
      description:
        "Recognizes and rewards students who have demonstrated exceptional performance in sports at university or national levels.",
      amount: "₹10,000",
      active: true,
    },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  // --- Handlers ---
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDeactivate = (id) => {
    setScholarships((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, active: false } : s
      )
    );
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

        {/* Scholarship List */}
        <div className="space-y-3">
          {scholarships.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Summary Row */}
              <div className="flex items-center justify-between px-5 py-3 ">
                <div>
                  <h2 className="font-medium text-base">{s.name}</h2>
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
                <div className="px-5 py-4 bg-gray-50 text-sm text-gray-700">
                  <p className="mb-3">{s.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      Amount: <span className="text-gray-800">{s.amount}</span>
                    </div>

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

        {/* Empty State */}
        {scholarships.length === 0 && (
          <div className="text-center text-gray-600 mt-10">
            No scholarships available.
          </div>
        )}
      </div>
    </div>
  );
}

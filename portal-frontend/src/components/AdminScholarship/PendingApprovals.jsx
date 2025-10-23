import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PendingApprovals() {
  const navigate = useNavigate();

  // --- Dummy Data ---
  const [applications] = useState([
    {
      id: 1,
      name: "Asha Sen",
      roll: "24ME10135",
      department: "Mechanical Engineering",
      email: "asha@example.com",
      gpa: "8.9",
      income: "₹2,50,000",
      reason: "Financial hardship due to family circumstances.",
    },
    {
      id: 2,
      name: "Rohan Kumar",
      roll: "24CS10217",
      department: "Computer Science and Engineering",
      email: "rohan@example.com",
      gpa: "9.2",
      income: "₹3,00,000",
      reason: "Wants to continue studies despite low family income.",
    },
    {
      id: 3,
      name: "Priya Das",
      roll: "24EE10309",
      department: "Electrical Engineering",
      email: "priya@example.com",
      gpa: "8.7",
      income: "₹2,80,000",
      reason: "Needs support for research project expenses.",
    },
  ]);

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

        {applications.length === 0 ? (
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
                  <div className="text-sm text-gray-600">Roll No: {app.roll}</div>
                  <div className="text-sm text-gray-600">
                    Department: {app.department}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Email: {app.email}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => navigate(`/admin/application/${app.id}`, { state: { app } })}
                    className="px-3 py-2 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

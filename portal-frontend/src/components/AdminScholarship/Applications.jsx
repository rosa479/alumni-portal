// src/components/ApplicationsList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Applications() {
  const navigate = useNavigate();

  // Sample student applications (replace later with API data)
  const applications = [
    { id: 1, name: "Asha Sen", roll: "24ME10135", approved: true, department: "Mechanical Engineering" },
    { id: 2, name: "Rohan Kumar", roll: "24CS10217", approved: true, department: "Computer Science and Engineering" },
    { id: 3, name: "Priya Das", roll: "24EE10309", approved: true, department: "Electrical Engineering" },
    { id: 4, name: "Asha Sen", roll: "24ME10135", approved: true, department: "Mechanical Engineering" },
    { id: 5, name: "Rohan Kumar", roll: "24CS10217", approved: true, department: "Computer Science and Engineering" },
    { id: 6, name: "Priya Das", roll: "24EE10309", approved: true, department: "Electrical Engineering" },
  ];

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

        <h1 className="text-3xl font-semibold mb-6">Scholarship Applications</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applications.map((app, index) => (
            <div
              key={index} // changed from app.id to index because some IDs are duplicated
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="text-lg font-semibold">{app.name}</div>
              <div className="text-sm text-gray-600">Roll No: {app.roll}</div>
              <div className="text-sm text-gray-600 mb-4">
                Department: {app.department}
              </div>

              <button
                onClick={() => navigate(`/admin/application/${app.id}`, { state: { app } })}
                className="mt-auto px-3 py-2 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

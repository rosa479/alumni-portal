// src/components/ActiveScholarships.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ActiveScholarships({ scholarships, onToggle }) {
  // Filter active scholarships
  const activeScholarships = scholarships.filter((s) => s.active);

  if (activeScholarships.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm text-gray-600">
        No active scholarships.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activeScholarships.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between p-3 bg-white rounded shadow-sm"
        >
          <div>
            <div className="font-medium">{s.title}</div>
            <div className="text-xs text-gray-500">Amount: {s.amount}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm">
              Active
            </div>
            <button
              onClick={() => onToggle(s.id)}
              className="px-3 py-1 rounded border text-sm"
            >
              Discontinue
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

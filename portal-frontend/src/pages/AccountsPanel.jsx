import React, { useState } from "react";
import Header from "../components/Header";

export default function AccountsPanel() {
  // --- Dummy Data ---
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Asha Sen",
      roll: "24ME10135",
      amount: "₹20,000",
      bank: "HDFC Bank - 1234567890",
      sent: false,
    },
    {
      id: 2,
      name: "Rohan Kumar",
      roll: "24CS10217",
      amount: "₹15,000",
      bank: "ICICI Bank - 9876543210",
      sent: false,
    },
    {
      id: 3,
      name: "Priya Das",
      roll: "24EE10309",
      amount: "₹25,000",
      bank: "SBI - 1122334455",
      sent: false,
    },
  ]);

  // --- Handlers ---
  const handleMarkSent = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, sent: true } : s))
    );
  };

  // --- JSX ---
  return (
    <>
    <Header />
    <div className="min-h-screen bg-[#F5F8FA] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Accounts Panel</h1>

        {/* Pending Scholarships */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-4">Pending Scholarships</h2>
          {students.filter((s) => !s.sent).length === 0 ? (
            <div className="text-gray-600">No pending scholarships.</div>
          ) : (
            <div className="space-y-3">
              {students
                .filter((s) => !s.sent)
                .map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-sm text-gray-600">Roll: {s.roll}</div>
                      <div className="text-sm text-gray-600">Amount: {s.amount}</div>
                      <div className="text-sm text-gray-600">Bank: {s.bank}</div>
                    </div>

                    <button
                      onClick={() => handleMarkSent(s.id)}
                      className="px-4 py-2 rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                    >
                      Mark Sent
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Sent Scholarships */}
        <div>
          <h2 className="text-xl font-medium mb-4">Sent Scholarships</h2>
          {students.filter((s) => s.sent).length === 0 ? (
            <div className="text-gray-600">No scholarships sent yet.</div>
          ) : (
            <div className="space-y-3">
              {students
                .filter((s) => s.sent)
                .map((s) => (
                  <div
                    key={s.id}
                    className="bg-gray-50 rounded-lg shadow-sm p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{s.name}</div>
                      <div className="text-sm text-gray-600">Roll: {s.roll}</div>
                      <div className="text-sm text-gray-600">Amount: {s.amount}</div>
                      <div className="text-sm text-gray-600">Bank: {s.bank}</div>
                    </div>
                    <span className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700">
                      Sent
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

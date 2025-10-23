// src/components/ApplicationDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample student data
  const students = [
    {
      id: 1,
      name: "Asha Sen",
      roll: "24ME10135",
      department: "Mechanical Engineering",
      fatherName: "Rajesh Sen",
      motherName: "Maya Sen",
      fatherOccupation: "Teacher",
      motherOccupation: "Homemaker",
      annualIncome: "₹4,50,000",
      photo: "/student_photos/asha.jpg",
      approved: true,
      documents: {
        aadhar: "/docs/asha_aadhar.pdf",
        bankPassbook: "/docs/asha_bank.pdf",
      },
    },
    {
      id: 2,
      name: "Rohan Kumar",
      roll: "24CS10217",
      department: "Computer Science and Engineering",
      fatherName: "Sunil Kumar",
      motherName: "Anita Kumar",
      fatherOccupation: "Engineer",
      motherOccupation: "Teacher",
      annualIncome: "₹6,00,000",
      photo: "/student_photos/rohan.jpg",
      approved: false,
      documents: {
        aadhar: "/docs/rohan_aadhar.pdf",
        bankPassbook: "/docs/rohan_bank.pdf",
      },
    },
    {
      id: 3,
      name: "Priya Das",
      roll: "24EE10309",
      department: "Electrical Engineering",
      fatherName: "Arun Das",
      motherName: "Sita Das",
      fatherOccupation: "Doctor",
      motherOccupation: "Homemaker",
      annualIncome: "₹5,20,000",
      photo: "/student_photos/priya.jpg",
      approved: true,
      documents: {
        aadhar: "/docs/priya_aadhar.pdf",
        bankPassbook: "/docs/priya_bank.pdf",
      },
    },
    {
      id: 4,
      name: "Asha Sen",
      roll: "24ME10135",
      department: "Mechanical Engineering",
      fatherName: "Rajesh Sen",
      motherName: "Maya Sen",
      fatherOccupation: "Teacher",
      motherOccupation: "Homemaker",
      annualIncome: "₹4,50,000",
      photo: "/student_photos/asha.jpg",
      approved: true,
      documents: {
        aadhar: "/docs/asha_aadhar.pdf",
        bankPassbook: "/docs/asha_bank.pdf",
      },
    },
    {
      id: 5,
      name: "Rohan Kumar",
      roll: "24CS10217",
      department: "Computer Science and Engineering",
      fatherName: "Sunil Kumar",
      motherName: "Anita Kumar",
      fatherOccupation: "Engineer",
      motherOccupation: "Teacher",
      annualIncome: "₹6,00,000",
      photo: "/student_photos/rohan.jpg",
      approved: false,
      documents: {
        aadhar: "/docs/rohan_aadhar.pdf",
        bankPassbook: "/docs/rohan_bank.pdf",
      },
    },
    {
      id: 6,
      name: "Priya Das",
      roll: "24EE10309",
      department: "Electrical Engineering",
      fatherName: "Arun Das",
      motherName: "Sita Das",
      fatherOccupation: "Doctor",
      motherOccupation: "Homemaker",
      annualIncome: "₹5,20,000",
      photo: "/student_photos/priya.jpg",
      approved: false,
      documents: {
        aadhar: "/docs/priya_aadhar.pdf",
        bankPassbook: "/docs/priya_bank.pdf",
      },
    },
    {
      id: 7,
      name: "Asha Sen",
      roll: "24ME10135",
      department: "Mechanical Engineering",
      fatherName: "Rajesh Sen",
      motherName: "Maya Sen",
      fatherOccupation: "Teacher",
      motherOccupation: "Homemaker",
      annualIncome: "₹4,50,000",
      photo: "/student_photos/asha.jpg",
      approved: false,
      documents: {
        aadhar: "/docs/asha_aadhar.pdf",
        bankPassbook: "/docs/asha_bank.pdf",
      },
    },
    {
      id: 8,
      name: "Rohan Kumar",
      roll: "24CS10217",
      department: "Computer Science and Engineering",
      fatherName: "Sunil Kumar",
      motherName: "Anita Kumar",
      fatherOccupation: "Engineer",
      motherOccupation: "Teacher",
      annualIncome: "₹6,00,000",
      photo: "/student_photos/rohan.jpg",
      approved: false,
      documents: {
        aadhar: "/docs/rohan_aadhar.pdf",
        bankPassbook: "/docs/rohan_bank.pdf",
      },
    },
    {
      id: 9,
      name: "Priya Das",
      roll: "24EE10309",
      department: "Electrical Engineering",
      fatherName: "Arun Das",
      motherName: "Sita Das",
      fatherOccupation: "Doctor",
      motherOccupation: "Homemaker",
      annualIncome: "₹5,20,000",
      photo: "/student_photos/priya.jpg",
      approved: false,
      documents: {
        aadhar: "/docs/priya_aadhar.pdf",
        bankPassbook: "/docs/priya_bank.pdf",
      },
    },
  ];

  const student = students.find((s) => s.id === parseInt(id));
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Student not found.
      </div>
    );
  }

  // --- Handlers ---
  const handleApprove = () => {
    alert(`✅ ${student.name}'s application has been approved.`);
    navigate(-1);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("⚠️ Please provide a reason for rejection.");
      return;
    }
    alert(`❌ ${student.name}'s application rejected.\nReason: ${rejectReason}`);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[hsl(199,89%,48%)] mb-4 hover:underline"
        >
          ← Back
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Student Photo */}
          <div className="w-full md:w-1/3 flex justify-center">
            <img
              src={student.photo}
              alt={student.name}
              className="rounded-lg shadow-md w-48 h-48 object-cover"
            />
          </div>

          {/* Student Info */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{student.name}</h2>

              {student.approved ? (
                <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-700 font-medium">
                  ✅ Approved
                </span>
              ) : (
                <span className="px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-700 font-medium">
                  Pending
                </span>
              )}
            </div>

            <p className="text-gray-700 text-sm">Roll No: {student.roll}</p>
            <p className="text-gray-700 text-sm">
              Department: {student.department}
            </p>

            <div className="mt-4">
              <h3 className="font-medium text-lg mb-2">General Details</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Father’s Name:</strong> {student.fatherName}
                </li>
                <li>
                  <strong>Mother’s Name:</strong> {student.motherName}
                </li>
                <li>
                  <strong>Father’s Occupation:</strong> {student.fatherOccupation}
                </li>
                <li>
                  <strong>Mother’s Occupation:</strong> {student.motherOccupation}
                </li>
                <li>
                  <strong>Annual Income:</strong> {student.annualIncome}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="mt-8">
          <h3 className="font-medium text-lg mb-2">Documents</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span>Aadhaar Card</span>
              <a
                href={student.documents.aadhar}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
              >
                View
              </a>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span>Bank Passbook</span>
              <a
                href={student.documents.bankPassbook}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
              >
                View
              </a>
            </div>
          </div>
        </div>

        {/* Approve / Reject Section */}
        {!student.approved && (
          <div className="mt-8 border-t pt-6">
            {!showRejectBox ? (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 text-sm rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectBox(true)}
                  className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Reason for Rejection:
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[hsl(199,89%,48%)] focus:border-[hsl(199,89%,48%)]"
                  placeholder="Enter rejection message..."
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    onClick={() => setShowRejectBox(false)}
                    className="px-4 py-2 text-sm rounded border border-gray-400 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

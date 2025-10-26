// src/components/ApplicationDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../interceptor";

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch application details from backend
  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/scholarships/applications/${id}/`);
        setApplication(response.data);
      } catch (err) {
        console.error("Error fetching application details:", err);
        setError("Failed to load application details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  // --- Handlers ---
  const handleApprove = async () => {
    try {
      setSubmitting(true);
      await axios.patch(`/scholarships/applications/${id}/approve/`, {
        approved: "APPROVED",
      });

      alert(`✅ ${application.name}'s application has been approved.`);
      navigate(-1);
    } catch (err) {
      console.error("Error approving application:", err);
      alert("Failed to approve application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("⚠️ Please provide a reason for rejection.");
      return;
    }

    try {
      setSubmitting(true);
      await axios.patch(`/scholarships/applications/${id}/approve/`, {
        approved: "REJECTED",
        rejection_reason: rejectReason,
      });

      alert(
        `❌ ${application.name}'s application rejected.\nReason: ${rejectReason}`
      );
      navigate(-1);
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Failed to reject application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading application details...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  // Not found state
  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Application not found.
      </div>
    );
  }

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
              src={application.photo || "/student_photos/default.jpg"}
              alt={application.name}
              className="rounded-lg shadow-md w-48 h-48 object-cover"
              onError={(e) => {
                e.target.src = "/student_photos/default.jpg";
              }}
            />
          </div>

          {/* Student Info */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{application.name}</h2>

              {application.approved === "APPROVED" ? (
                <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-700 font-medium">
                  ✅ Approved
                </span>
              ) : application.approved === "REJECTED" ? (
                <span className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 font-medium">
                  ❌ Rejected
                </span>
              ) : (
                <span className="px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-700 font-medium">
                  Pending
                </span>
              )}
            </div>

            <p className="text-gray-700 text-sm">Roll No: {application.roll}</p>
            <p className="text-gray-700 text-sm">
              Department: {application.department}
            </p>
            <p className="text-gray-700 text-sm">Email: {application.email}</p>
            <p className="text-gray-700 text-sm">GPA: {application.gpa}</p>

            {application.scholarship_title && (
              <p className="text-blue-600 text-sm font-medium">
                Scholarship: {application.scholarship_title}
              </p>
            )}

            <div className="mt-4">
              <h3 className="font-medium text-lg mb-2">General Details</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  <strong>Father's Name:</strong> {application.father_name}
                </li>
                <li>
                  <strong>Mother's Name:</strong> {application.mother_name}
                </li>
                <li>
                  <strong>Father's Occupation:</strong>{" "}
                  {application.father_occupation}
                </li>
                <li>
                  <strong>Mother's Occupation:</strong>{" "}
                  {application.mother_occupation}
                </li>
                <li>
                  <strong>Annual Income:</strong> {application.annual_income}
                </li>
              </ul>
            </div>

            {application.reason && (
              <div className="mt-4">
                <h3 className="font-medium text-lg mb-2">
                  Reason for Application
                </h3>
                <p className="text-sm text-gray-700">{application.reason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="mt-8">
          <h3 className="font-medium text-lg mb-2">Documents</h3>

          <div className="space-y-3">
            {application.aadhar_document && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>Aadhaar Card</span>
                <a
                  href={application.aadhar_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                >
                  View
                </a>
              </div>
            )}

            {application.bank_passbook_document && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>Bank Passbook</span>
                <a
                  href={application.bank_passbook_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                >
                  View
                </a>
              </div>
            )}

            {application.income_certificate_document && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>Income Certificate</span>
                <a
                  href={application.income_certificate_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                >
                  View
                </a>
              </div>
            )}

            {application.marksheet_document && (
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span>Marksheet</span>
                <a
                  href={application.marksheet_document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm rounded bg-[hsl(199,89%,48%)] text-white hover:bg-blue-500"
                >
                  View
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Approve / Reject Section */}
        {application.approved === "PENDING" && (
          <div className="mt-8 border-t pt-6">
            {!showRejectBox ? (
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className={`px-4 py-2 text-sm rounded text-white ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {submitting ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => setShowRejectBox(true)}
                  disabled={submitting}
                  className={`px-4 py-2 text-sm rounded text-white ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
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
                    disabled={submitting}
                    className="px-4 py-2 text-sm rounded border border-gray-400 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={submitting}
                    className={`px-4 py-2 text-sm rounded text-white ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {submitting ? "Processing..." : "Confirm Reject"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show rejection reason if rejected */}
        {application.approved === "REJECTED" &&
          application.rejection_reason && (
            <div className="mt-8 border-t pt-6">
              <h3 className="font-medium text-lg mb-2 text-red-600">
                Rejection Reason
              </h3>
              <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg">
                {application.rejection_reason}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const navigate = useNavigate();

  // --- State Management ---
  const [scholarships] = useState([
    { id: 1, title: "Merit Scholarship", active: true, amount: "₹20,000" },
    { id: 2, title: "Need-based Aid", active: true, amount: "₹15,000" },
  ]);

  const [applications] = useState([
    { id: 101, name: "Asha Sen", email: "asha@example.com", approved: false },
    { id: 102, name: "Rohan Kumar", email: "rohan@example.com", approved: true },
  ]);

  const [posts] = useState([
    { id: 201, title: "Scholarship deadline extended", author: "Admin", date: "2025-10-15" },
    { id: 202, title: "New mentorship program", author: "Prof. X", date: "2025-10-02" },
  ]);

  // Stakeholder meeting conclusions for each scholarship
  const [stakeholderConclusions] = useState({
    1: [
      { date: "2025-10-10", conclusion: "Prioritize high-merit applicants for early disbursal." },
      { date: "2025-10-12", conclusion: "Increase outreach to rural schools for Merit Scholarship." },
    ],
    2: [
      { date: "2025-09-15", conclusion: "Ensure transparent fund allocation." },
      { date: "2025-09-20", conclusion: "Monitor disbursement closely for Need-based Aid." },
    ],
  });

  // Latest update to attach under each scholarship
  const [latestUpdate] = useState({
    date: "2025-10-10",
    summary: "Application review window extended by one week for all scholarships.",
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const openModal = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedScholarship(null);
  };

  // Derived stats
  const stats = useMemo(
    () => ({
      totalApplications: applications.length,
      pendingApprovals: applications.filter((u) => !u.approved).length,
      totalPosts: posts.length,
      activeScholarships: scholarships.filter((s) => s.active).length,
    }),
    [applications, posts, scholarships]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold">Admin — Scholarships</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage scholarships, applications, and stakeholder conclusions.
        </p>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={String(stats.totalApplications)}
          buttonLabel="View"
          onClick={() => navigate("/admin/applications")}
        />
        <StatCard
          title="Pending Approvals"
          value={String(stats.pendingApprovals)}
          buttonLabel="View"
          onClick={() => navigate("/admin/pending")}
        />
        <StatCard
          title="Active Scholarships"
          value={String(stats.activeScholarships)}
          buttonLabel="View"
          onClick={() => navigate("/admin/scholarships")}
        />
        <div
          className="bg-[hsl(199,89%,48%)] hover:bg-blue-500 p-4 rounded-lg shadow-sm flex flex-col justify-between cursor-pointer"
          onClick={() => navigate("/admin/scholarships/new")}
        >
          <div className="text-sm text-white">Create New Scholarship</div>
          <div className="flex justify-center items-center h-20 w-full">
            <img className="h-10 w-10 invert" src="./plus.png" alt="add" />
          </div>
        </div>
      </section>

      {/* Scholarship List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Scholarships</h2>
          <span className="text-sm text-gray-500">Manage active scholarships</span>
        </div>

        <div className="space-y-2">
          {scholarships.map((s) => (
            <div key={s.id} className="p-3 bg-white rounded shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-gray-500">Amount: {s.amount}</div>
                </div>
                <button
                  onClick={() => openModal(s)}
                  className="px-3 py-1 rounded border text-sm bg-[hsl(199,89%,48%)] hover:bg-blue-500 text-white"
                >
                  View Updates
                </button>
              </div>

              {/* Latest Update Section */}
              <div className="mt-2 text-sm text-gray-600 ">
                <span className="font-medium text-blue-500">Latest Update:</span>{" "}
                <span>{latestUpdate.summary}</span>
                <div className="text-xs text-gray-500 mt-1">
                  Date: {latestUpdate.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal */}
      {showModal && selectedScholarship && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">
              Stakeholder Conclusions — {selectedScholarship.title}
            </h2>

            <ul className="space-y-3 border-l-2 border-gray-300 pl-4">
              {(stakeholderConclusions[selectedScholarship.id] || []).map((item, idx) => (
                <li key={idx} className="relative">
                  <div className="absolute -left-3 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  <span className="text-sm text-gray-500">{item.date}</span>
                  <p className="text-gray-700">{item.conclusion}</p>
                </li>
              ))}
            </ul>

            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// UI Helper Components
function Card({ children }) {
  return <div className="p-4 bg-white rounded-lg shadow-sm">{children}</div>;
}

function StatCard({ title, value, buttonLabel, onClick }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
      </div>
      <button
        onClick={onClick}
        className="mt-3 self-end px-3 py-1 rounded bg-[hsl(199,89%,48%)] text-white text-sm hover:bg-blue-500"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

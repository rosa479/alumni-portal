import React, { useState, useMemo } from "react";
import {} from "react-router-dom";

// AdminPanel.jsx
// Full admin control: scholarships, approvals, posts, meetings, and stats.

export default function AdminPanel() {
  // --- State Management ---
  const [scholarships, setScholarships] = useState([
    { id: 1, title: "Merit Scholarship", active: true, amount: "₹20,000" },
    { id: 2, title: "Need-based Aid", active: true, amount: "₹15,000" },
  ]);

  const [meetingOutcomes, setMeetingOutcomes] = useState([
    { id: 1, date: "2025-10-10", summary: "Increase outreach to rural schools." },
    { id: 2, date: "2025-09-05", summary: "Reduce review time to 3 weeks." },
  ]);

  const [applications, setApplications] = useState([
    { id: 101, name: "Asha Sen", email: "asha@example.com", approved: false },
    { id: 102, name: "Rohan Kumar", email: "rohan@example.com", approved: true },
  ]);

  const [posts, setPosts] = useState([
    { id: 201, title: "Scholarship deadline extended", author: "Admin", date: "2025-10-15" },
    { id: 202, title: "New mentorship program", author: "Prof. X", date: "2025-10-02" },
  ]);

  // Form inputs
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // Derived stats
  const stats = useMemo(() => ({
    totalApplications: applications.length,
    pendingApprovals: applications.filter((u) => !u.approved).length,
    totalPosts: posts.length,
    activeScholarships: scholarships.filter((s) => s.active).length,
  }), [applications, posts, scholarships]);

  // --- Handlers ---
  function handleCreateScholarship(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const id = Date.now();
    setScholarships((prev) => [
      ...prev,
      { id, title: newTitle.trim(), active: true, amount: newAmount || "TBD" },
    ]);
    setNewTitle("");
    setNewAmount("");
  }

  function toggleScholarship(id) {
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  }

  function approveUser(id) {
    setApplications((prev) =>
      prev.map((u) => (u.id === id ? { ...u, approved: true } : u))
    );
  }

  function deleteUser(id) {
    setApplications((prev) => prev.filter((u) => u.id !== id));
  }

  function deletePost(id) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  // --- JSX ---
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header>
        <h1 className="text-3xl font-semibold">Admin — Scholarships</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage scholarships, meetings, user approvals, and posts.
        </p>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={String(stats.totalApplications)}
          buttonLabel="View"
          onClick={() => alert("Opening Applications...")}
        />
        <StatCard
          title="Pending Approvals"
          value={String(stats.pendingApprovals)}
          buttonLabel="View"
          onClick={() => alert("Showing Pending Approvals...")}
        />
        <StatCard
          title="Active Scholarships"
          value={String(stats.activeScholarships)}
          buttonLabel="View"
          onClick={() => alert("Showing Active Scholarships...")}
        />
        <div className="bg-[hsl(199,89%,48%)] hover:bg-blue-500 p-4 rounded-lg shadow-sm flex flex-col justify-between">
          <div className="text-sm text-white">Create New Scholarship</div>
          <div className="flex justify-center items-center h-20 w-full">
            <img className="h-10 w-10 invert" src="./plus.png" alt="add" />
          </div>
        </div>
      </section>

      {/* Scholarship Management */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Scholarships</h2>
          <span className="text-sm text-gray-500">Manage active scholarships</span>
        </div>

        <form onSubmit={handleCreateScholarship} className="flex gap-3 mb-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Scholarship Title"
            className="border p-2 rounded flex-1"
          />
          <input
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            placeholder="Amount (₹)"
            className="border p-2 rounded w-40"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[hsl(199,89%,48%)] text-white"
          >
            Add
          </button>
        </form>

        <div className="space-y-2">
          {scholarships.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 bg-white rounded shadow-sm"
            >
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-xs text-gray-500">Amount: {s.amount}</div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`px-2 py-1 rounded text-sm ${
                    s.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {s.active ? "Active" : "Discontinued"}
                </div>
                <button
                  onClick={() => toggleScholarship(s.id)}
                  className="px-3 py-1 rounded border text-sm"
                >
                  {s.active ? "Discontinue" : "Re-activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Meeting Outcomes */}
      <Card>
        <h2 className="text-lg font-medium mb-4">Stakeholders — Meeting Outcomes</h2>
        <div className="space-y-2">
          {meetingOutcomes.map((m) => (
            <div key={m.id} className="p-3 bg-white rounded shadow-sm">
              <div className="text-sm text-gray-500">{m.date}</div>
              <div className="mt-1">{m.summary}</div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}

// --------- UI Helper Components ---------
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

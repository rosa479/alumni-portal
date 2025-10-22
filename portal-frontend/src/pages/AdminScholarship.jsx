import React, { useState, useMemo } from "react";
import Header from "../components/Header";


// AdminScholarship.jsx
// Single-file React component for an admin panel that can:
// - Create / discontinue scholarships
// - Show stakeholders meeting outcomes
// - Approve / delete Applications
// - Delete posts
// - Show current user & post statistics

// NOTE: This is a front-end-only mock. Replace the local state handlers
// with API calls (fetch/axios) when integrating with a backend.

export default function AdminScholarship() {
  // --- Sample state ---
  const [scholarships, setScholarships] = useState([
    { id: 1, title: "Merit Scholarship", active: true, amount: "₹20,000" },
    { id: 2, title: "Need-based Aid", active: true, amount: "₹15,000" },
  ]);

  const [meetingOutcomes, setMeetingOutcomes] = useState([
    { id: 1, date: "2025-10-10", summary: "Increase outreach to rural schools." },
    { id: 2, date: "2025-09-05", summary: "Streamline application review timeline to 3 weeks." },
  ]);

  const [Applications, setApplications] = useState([
    { id: 101, name: "Asha Sen", role: "student", approved: false, email: "asha@example.com" },
    { id: 102, name: "Rohan Kumar", role: "student", approved: true, email: "rohan@example.com" },
  ]);

  const [posts, setPosts] = useState([
    { id: 201, title: "Scholarship deadline extended", author: "Admin", date: "2025-10-15" },
    { id: 202, title: "New mentorship program", author: "Prof. X", date: "2025-10-02" },
  ]);

  // Form controls
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");

  // --- Derived stats ---
  const stats = useMemo(() => {
    return {
      totalApplications: Applications.length,
      pendingApprovals: Applications.filter((u) => !u.approved).length,
      totalPosts: posts.length,
      activeScholarships: scholarships.filter((s) => s.active).length,
    };
  }, [Applications, posts, scholarships]);

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
    setScholarships((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  }

  // Quick UI helpers
  const [outcomeText, setOutcomeText] = useState("");

  return (
    <>
      <Header />
      <div className="p-6 min-h-screen bg-[#F5F8FA]">
        <div className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-semibold">Admin — Scholarships</h1>
            <p className="text-sm text-gray-600 mt-1">Manage scholarships, stakeholders outcomes, user approvals and site content.</p>
          </header>

        {/* Stats row */}
        <section className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Applications"
            value={String(stats.totalApplications)}
            buttonLabel="View"
            onClick={() => alert("Navigating to Applications page...")}
          />
          <StatCard
            title="Pending Approvals"
            value={String(stats.pendingApprovals)}
            buttonLabel="View"
            onClick={() => alert("Showing pending approvals...")}
          />
          <StatCard
            title="Active Scholarships"
            value={String(stats.activeScholarships)}
            buttonLabel="View"
            onClick={() => alert("Viewing active scholarships...")}
          />
          <div className="bg-[hsl(199,89%,48%)] hover:bg-blue-500 p-4 bg- rounded-lg shadow-sm flex flex-col justify-between">
            <div className="text-sm text-white">Create new Scholarship</div>
            <div className="flex justify-center items-center h-20 w-full"><img className="h-15 w-15 invert" src="./plus.png" alt="" /></div>
          </div>
        </section>


        <div className="gap-6">
          {/* Left column: Scholarships + meeting outcomes */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Scholarships</h2>
                <span className="text-sm text-gray-500">Manage active scholarships</span>
              </div>


              <div className="space-y-2">
                {scholarships.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-white rounded shadow-sm">
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-gray-500">Amount: {s.amount}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-sm ${s.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
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

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Stakeholders — Meeting outcomes</h2>
              </div>

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
        </div>
      </div>
    </div>
    </>
  );
}


// ---------- Small presentational helpers ----------
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


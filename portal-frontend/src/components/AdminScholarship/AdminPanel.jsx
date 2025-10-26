import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../interceptor";

export default function AdminPanel() {
  const navigate = useNavigate();

  // --- State Management ---
  const [scholarships, setScholarships] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApprovals: 0,
    activeScholarships: 0,
    totalScholarships: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded data for backward compatibility (will be replaced by API data)
  const [hardcodedScholarships] = useState([
    {
      id: 1,
      title: "Kirttan B Behra Best All Rounder (BAR) Student Award",
      type: "Award",
      active: true,
      amount: "₹11,70,000",
      corpus: "₹58,64,079",
    },
    {
      id: 2,
      title: "Dr. Nirni Kumar Memorial Best Student Award",
      type: "Award",
      active: true,
      amount: "₹80,000",
      corpus: "₹9,98,158",
    },
    {
      id: 3,
      title: "Markose Thomas Memorial Award for Best Research Paper in CSE",
      type: "Award",
      active: true,
      amount: "—",
      corpus: "₹30,24,115",
    },
    {
      id: 4,
      title: "Prof. G P Sastry Student Excellence Award",
      type: "Award",
      active: true,
      amount: "—",
      corpus: "₹20,15,390",
    },
    {
      id: 8,
      title: "Aruna & Ram Gopal Khandelia Award",
      type: "Award",
      active: true,
      amount: "₹4,70,697",
      corpus: "₹78,47,600",
    },
    {
      id: 14,
      title: "Richard D Souza - Sports Scholarship",
      type: "Scholarship",
      active: true,
      amount: "—",
      corpus: "₹24,23,608",
    },
    {
      id: 15,
      title: "Learn-Earn-Return",
      type: "Scholarship",
      active: true,
      amount: "—",
      corpus: "₹1,23,81,072",
    },
    {
      id: 17,
      title: "Arupratan Gupta Memorial Endowed Scholarship",
      type: "Scholarship",
      active: true,
      amount: "—",
      corpus: "₹16,98,355",
    },
  ]);

  const [applications] = useState([
    {
      id: 101,
      name: "Tanay Gupta",
      roll: "24IM10008",
      email: "tanay@iitkgp.ac.in",
      scholarship: "Prof. G P Sastry Student Excellence Award",
      approved: true,
    },
    {
      id: 102,
      name: "Somani Prathmesh Amit",
      roll: "21NA10033",
      email: "prathmesh@iitkgp.ac.in",
      scholarship: "Dr. Nirni Kumar Memorial Best Student Award",
      approved: true,
    },
    {
      id: 103,
      name: "Piran Karkaria",
      roll: "20IM3FP52",
      email: "piran@iitkgp.ac.in",
      scholarship: "Kirttan B Behra Best All Rounder Award",
      approved: true,
    },
    {
      id: 104,
      name: "Jangili Poojitha",
      roll: "21CE31015",
      email: "poojitha@iitkgp.ac.in",
      scholarship: "Richard D Souza - Sports Scholarship",
      approved: false,
    },
    {
      id: 105,
      name: "Annapureddy Vikhram Reddy",
      roll: "23EC10010",
      email: "vikhram@iitkgp.ac.in",
      scholarship: "Arupratan Gupta Memorial Scholarship",
      approved: true,
    },
  ]);

  const [posts] = useState([
    {
      id: 201,
      title: "New scholarship applications open for 2025-26",
      author: "Admin",
      date: "2025-10-20",
    },
    {
      id: 202,
      title: "Aruna & Ram Gopal Khandelia Award results announced",
      author: "Academic Section",
      date: "2025-10-15",
    },
  ]);

  // Stakeholder meeting conclusions for each scholarship
  const [stakeholderConclusions] = useState({
    1: [
      {
        date: "2025-09-15",
        conclusion:
          "Awardees selected: Piran Karkaria, Kosha Shirish Lele, Warke Heramb Manikarao, Syed Faiz Reze Zaidi.",
      },
      {
        date: "2025-08-10",
        conclusion:
          "Committee reviewed 47 applications for all-rounder performance across academics, sports, and co-curricular activities.",
      },
    ],
    2: [
      {
        date: "2025-09-20",
        conclusion:
          "Somani Prathmesh Amit selected as the recipient for AY 2024-25.",
      },
      {
        date: "2025-08-25",
        conclusion:
          "Selection committee emphasized overall student excellence and contribution to the institute.",
      },
    ],
    14: [
      {
        date: "2025-10-01",
        conclusion:
          "Ms Jangili Poojitha selected for outstanding performance in athletics.",
      },
      {
        date: "2025-09-15",
        conclusion: "New advertisement for 2025-26 to be published shortly.",
      },
    ],
    15: [
      {
        date: "2025-08-30",
        conclusion:
          "Three students selected for Spring Semester 2024-25 under Learn-Earn-Return program.",
      },
      {
        date: "2025-07-20",
        conclusion:
          "Program continues to support financially needy students through work-study opportunities.",
      },
    ],
  });

  // Latest update to attach under each scholarship
  const [latestUpdate] = useState({
    date: "2025-10-20",
    summary:
      "Academic Section is processing new applications for the 2025-26 session. Results for pending scholarships will be announced by February 2026.",
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

  // Fetch statistics and scholarships on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch statistics
        const statsResponse = await axios.get("/scholarships/statistics/");
        setStats({
          totalApplications: statsResponse.data.total_applications,
          pendingApprovals: statsResponse.data.pending_applications,
          activeScholarships: statsResponse.data.active_scholarships,
          totalScholarships: statsResponse.data.total_scholarships,
        });

        // Fetch active scholarships (limited to 8 for dashboard display)
        const scholarshipsResponse = await axios.get("/scholarships/list/");
        const fetchedScholarships = scholarshipsResponse.data
          .slice(0, 8)
          .map((s) => ({
            id: s.id,
            title: s.title,
            type: s.description.includes("Merit-Based")
              ? "Merit-Based"
              : s.description.includes("Need-Based")
              ? "Need-Based"
              : "Scholarship",
            active: s.status === "ACTIVE",
            amount: s.target_amount
              ? `₹${parseFloat(s.target_amount).toLocaleString("en-IN")}`
              : "—",
            corpus: s.current_amount
              ? `₹${parseFloat(s.current_amount).toLocaleString("en-IN")}`
              : "—",
          }));

        setScholarships(fetchedScholarships);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scholarship data:", err);
        setError("Failed to load scholarship data. Using cached data.");
        // Fall back to hardcoded data
        setScholarships(hardcodedScholarships);
        setStats({
          totalApplications: applications.length,
          pendingApprovals: applications.filter((u) => !u.approved).length,
          activeScholarships: hardcodedScholarships.filter((s) => s.active)
            .length,
          totalScholarships: hardcodedScholarships.length,
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [applications, hardcodedScholarships]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-semibold">Manage Scholarships</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage scholarships, applications, and stakeholder conclusions.
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(199,89%,48%)]"></div>
          <p className="mt-2 text-gray-600">Loading scholarship data...</p>
        </div>
      )}

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.totalApplications.toString()}
          buttonLabel="View"
          onClick={() => navigate("/admin/applications")}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals.toString()}
          buttonLabel="View"
          onClick={() => navigate("/admin/pending")}
        />
        <StatCard
          title="Active Scholarships"
          value={stats.activeScholarships.toString()}
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
      {!loading && scholarships.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Scholarships</h2>
            <span className="text-sm text-gray-500">
              Manage active scholarships
            </span>
          </div>

          <div className="space-y-2">
            {scholarships.map((s) => (
              <div
                key={s.id}
                className="p-3 bg-white rounded shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium">{s.title}</div>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                        {s.type}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Target Amount: {s.amount} • Current Amount: {s.corpus}
                    </div>
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
                  <span className="font-medium text-blue-500">
                    Latest Update:
                  </span>{" "}
                  <span>{latestUpdate.summary}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Date: {latestUpdate.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal */}
      {showModal && selectedScholarship && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">
              Stakeholder Conclusions — {selectedScholarship.title}
            </h2>

            <ul className="space-y-3 border-l-2 border-gray-300 pl-4">
              {(stakeholderConclusions[selectedScholarship.id] || []).map(
                (item, idx) => (
                  <li key={idx} className="relative">
                    <div className="absolute -left-3 w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    <span className="text-sm text-gray-500">{item.date}</span>
                    <p className="text-gray-700">{item.conclusion}</p>
                  </li>
                )
              )}
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

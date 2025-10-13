// src/features/communities/CommunitiesPage.jsx
import React, { useState, useEffect } from "react";
import { Search } from "react-feather";
import CommunityCard from "../components/CommunityCard";
import apiClient from "../interceptor";

// // Mock data, which would come from your API
// const communities = [
//   {
//     id: 1,
//     name: "Entrepreneurship Hub",
//     description:
//       "Connect with founders, investors, and mentors in the KGP network.",
//     members: 1250,
//   },
//   {
//     id: 2,
//     name: "AI & Machine Learning",
//     description:
//       "Discussions on the latest trends, research, and career opportunities in AI/ML.",
//     members: 2800,
//   },
//   {
//     id: 3,
//     name: "Bay Area Alumni",
//     description:
//       "A local chapter for alumni living and working in the San Francisco Bay Area.",
//     members: 850,
//   },
//   {
//     id: 4,
//     name: "Finance & Investing",
//     description:
//       "A community for professionals in banking, private equity, and venture capital.",
//     members: 975,
//   },
//   {
//     id: 5,
//     name: "Research & Academia",
//     description:
//       "Connecting KGPians pursuing careers in academic and industrial research.",
//     members: 640,
//   },
//   {
//     id: 6,
//     name: "KGP '08 Batch",
//     description:
//       "A private group for the graduating class of 2008 to reconnect and network.",
//     members: 215,
//   },
// ];

function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // communities api setup
  // 1. The community object is now a state variable, initialized to null.
  const [communityBackend, setCommunityBackend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 3. Send a GET request using the configured apiClient.
        const response = await apiClient.get("/communities/");

        // 4. Print the received object to the console, as requested.
        console.log("Received CommunityBackend Data:", response.data);

        // 5. Update the communityBackend state with the data from the API response.
        setCommunityBackend(response.data);
      } catch (err) {
        console.error("Failed to fetch communityBackend profile:", err);
        setError("Could not load communityBackend information.");
      } finally {
        // 6. Set loading to false regardless of success or failure.
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []); // The empty dependency array ensures this effect runs only once.

  // --- Render logic based on the state ---

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // This check prevents rendering errors if the API returns an empty object
  if (!communityBackend) {
    return null;
  }

  // Filter communities based on search term
  const filteredCommunities = communityBackend.filter(
    (community) =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Page Header and Search */}
        <div className="mb-12">
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Discover Communities
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find and join groups that match your interests and professional
              goals.
            </p>
            <div className="relative max-w-2xl">
              <input
                type="text"
                placeholder="Search for communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-800/20 focus:border-blue-800 focus:outline-none text-lg"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={24}
              />
            </div>
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <div className="mb-8">
            <p className="text-lg text-gray-600">
              {filteredCommunities.length} community
              {filteredCommunities.length !== 1 ? "ies" : ""} found for "
              {searchTerm}"
            </p>
          </div>
        )}

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCommunities.length > 0 ? (
            filteredCommunities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                description={community.description}
                members={community.members_count}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-500 mb-2">
                  No communities found
                </h3>
                <p className="text-gray-400 mb-6">
                  Try adjusting your search terms or browse all communities.
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunitiesPage;

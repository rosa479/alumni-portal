// src/features/communities/CommunityDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommunityHeader from "../components/CommunityHeader";
import CreatePost from "../components/CreatePost"; // We can reuse this
import Post from "../components/Post/Post"; // and this!
import apiClient from "../interceptor";

// Let's create a more detailed mock database
const communitiesDBMock = {
  1: {
    id: 1,
    name: "Entrepreneurship Hub",
    description:
      "Connect with founders, investors, and mentors in the KGP network.",
    members: 1250,
    posts: [
      {
        id: 101,
        authorName: "Rohan Shah",
        authorAvatar: "https://i.pravatar.cc/150?u=rohan",
        meta: "2h ago",
        content:
          "Just closed our Series A funding! Huge thanks to the KGP network for the early support.",
      },
      {
        id: 102,
        authorName: "Priya Mehta",
        authorAvatar: "https://i.pravatar.cc/150?u=priya",
        meta: "1d ago",
        content:
          "Looking for a co-founder with a strong tech background for a new EdTech startup. DM me!",
      },
    ],
  },
  2: {
    id: 2,
    name: "AI & Machine Learning",
    description:
      "Discussions on the latest trends, research, and career opportunities in AI/ML.",
    members: 2800,
    posts: [
      {
        id: 201,
        authorName: "Dr. Vikram Singh",
        authorAvatar: "https://i.pravatar.cc/150?u=vikram",
        meta: "8h ago",
        content:
          "Just published a new paper on transformer models in NLP. Happy to share the pre-print with anyone interested.",
      },
    ],
  },
  // Add other communities here...
};

function CommunityDetailPage() {
  const { communityId } = useParams(); // Get the ID from the URL, e.g., "1"

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
        const response = await apiClient.get("/api/communities/");

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

  const community = communityBackend.find((item) => item.id === communityId);

  // Handle case where community doesn't exist
  if (!community) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 min-h-screen">
        <div className="container mx-auto p-8 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Community Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              The community you're looking for doesn't exist or has been
              removed.
            </p>
            <a
              href="/communities"
              className="bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Communities
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        <CommunityHeader community={community} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <main className="lg:col-span-2 space-y-6">
            {/* Note: In a real app, you'd want a more specific CreatePost component */}
            <CreatePost />
            <div className="space-y-6">
              {community.posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  authorName={post.authorName}
                  authorAvatar={post.authorAvatar}
                  meta={post.meta}
                  content={post.content}
                />
              ))}
            </div>
          </main>

          {/* Community-specific right sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                About Community
              </h4>
              <p className="text-gray-600 mb-6">
                This is a space for members to share insights, ask questions,
                and collaborate.
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Members</span>
                  <span className="font-bold text-blue-800">
                    {community.members.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-bold text-blue-800">
                    {community.posts.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Community Rules
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be respectful and professional</li>
                <li>• Stay on topic and relevant</li>
                <li>• No spam or self-promotion</li>
                <li>• Help fellow community members</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetailPage;

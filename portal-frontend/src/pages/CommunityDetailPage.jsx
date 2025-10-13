// src/features/communities/CommunityDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommunityHeader from "../components/CommunityHeader";
import CreatePost from "../components/CreatePost"; // already imported
import Post from "../components/Post/Post"; // and this!
import apiClient from "../interceptor";

function CommunityDetailPage() {
  const { communityId } = useParams(); // Get the ID from the URL, e.g., "1"

  // communities api setup
  // 1. The community object is now a state variable, initialized to null.
  const [communityBackend, setCommunityBackend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");

  // 2. useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch community details
        const communityResponse = await apiClient.get(`/communities/${communityId}/`);
        console.log("Received CommunityBackend Data:", communityResponse.data);
        setCommunityBackend([communityResponse.data]);

        // Fetch user profile for avatar
        try {
          const userResponse = await apiClient.get('/profiles/me/');
          setUserProfile(userResponse.data);
        } catch (userErr) {
          console.log("Could not fetch user profile, using default avatar");
        }
      } catch (err) {
        console.error("Failed to fetch communityBackend profile:", err);
        setError("Could not load communityBackend information.");
      } finally {
        // 6. Set loading to false regardless of success or failure.
        setLoading(false);
      }
    };

    fetchData();
  }, [communityId]); // Include communityId in dependency array

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
            {/* Quick Post Bar or CreatePost Form */}
            {!showCreatePost ? (
              <div className="bg-white rounded-2xl shadow flex items-center p-4 mb-4">
                <img
                  src={userProfile?.alumni_profile?.profile_picture_url || "https://i.pravatar.cc/150?u=user"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <input
                  type="text"
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
                  placeholder={`What's your post about?`}
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  readOnly
                  style={{ cursor: "pointer" }}
                  onFocus={() => setShowCreatePost(true)}
                />
                <button
                  className="ml-4 px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                  onClick={() => setShowCreatePost(true)}
                >
                  Create Post
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow p-4 mb-4">
                <CreatePost
                  avatar={userProfile?.alumni_profile?.profile_picture_url || "https://i.pravatar.cc/150?u=user"}
                  communities={[community]}
                  initialTitle={quickTitle}
                  onClose={() => {
                    setShowCreatePost(false);
                    setQuickTitle("");
                  }}
                />
              </div>
            )}

            <div className="space-y-6">
              {community.latest_posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  authorName={post.author_name}
                  created_at={post.created_at}
                  authorAvatar={post.author_profile_picture}
                  content={post.content}
                  title={post.title}
                  imageUrl={post.image_url}
                  tags={post.tags}
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
                    {community.members_count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-bold text-blue-800">
                    {community.posts_count}
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

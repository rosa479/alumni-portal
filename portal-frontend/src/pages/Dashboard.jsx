import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Hash, ChevronRight, Plus, Star } from "react-feather";
import Header from "../components/Header";
import PostDashboard from "../components/Post/PostDashboard";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import apiClient from "../interceptor";

// Mock data for the posts, which would normally come from your API
const postsData = [
  {
    id: 1,
    authorName: "Ankit Sharma",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    meta: '<a href="#" class="text-primary-blue hover:underline">Campus Events</a> • 2h ago',
    content:
      "So excited for the upcoming Alumni Meetup 2025 on campus! Who's planning to be there? It would be great to reconnect with old friends and make new connections. Let's make it a memorable one! 🎉",
  },
  {
    id: 2,
    authorName: "Priya Singh",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    meta: '<a href="#" class="text-primary-blue hover:underline">Tech Careers</a> • 5h ago',
    content:
      "My team at Google is hiring Senior SDEs for our Bangalore office. The role involves working on large-scale distributed systems. KGP alumni referrals are highly encouraged. Feel free to DM me for details!",
  },
];

function MobileSections() {
  const [activeTab, setActiveTab] = useState("people");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recommendations for "People You May Know"
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await apiClient.get("/profiles/recommendations/");
        setRecommendations(response.data.results || []);
      } catch (error) {
        setRecommendations([
          // fallback mock data
          {
            id: 1,
            alumni_profile: {
              full_name: "Riya Mehta",
              department: "CSE",
              graduation_year: 2020,
              profile_picture_url: "https://i.pravatar.cc/150?img=1",
            },
            recommendation_reason: "Same department",
          },
          {
            id: 2,
            alumni_profile: {
              full_name: "Arjun Verma",
              department: "EE",
              graduation_year: 2019,
              profile_picture_url: "https://i.pravatar.cc/150?img=2",
            },
            recommendation_reason: "Close batch mate",
          },
          {
            id: 3,
            alumni_profile: {
              full_name: "Neha Gupta",
              department: "ME",
              graduation_year: 2018,
              profile_picture_url: "https://i.pravatar.cc/150?img=3",
            },
            recommendation_reason: "Fellow alumni",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const peopleData = [
    {
      id: 1,
      name: "Ankit Sharma",
      role: "Software Engineer at Google",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Priya Singh",
      role: "Product Manager at Microsoft",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Raj Kumar",
      role: "Data Scientist at Meta",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
  ];

  const communitiesData = [
    { id: 1, name: "Tech Careers", members: 1240, isJoined: true },
    { id: 2, name: "Alumni Network", members: 850, isJoined: true },
    { id: 3, name: "Entrepreneurship", members: 650, isJoined: false },
  ];

  const trendingData = [
    { id: 1, name: "Campus Events", members: 2100, growth: "+12%" },
    { id: 2, name: "Job Opportunities", members: 1850, growth: "+8%" },
    { id: 3, name: "Research & Innovation", members: 920, growth: "+15%" },
  ];

  return (
    <div className="block sm:hidden mb-6">
      {/* Tab Navigation */}
      <div className="flex bg-white rounded-xl p-1 shadow-sm mb-4">
        <button
          onClick={() => setActiveTab("people")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "people"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="hidden xs:block">People</span>
        </button>
        <button
          onClick={() => setActiveTab("communities")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "communities"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Hash className="w-4 h-4" />
          <span className="hidden xs:block">Groups</span>
        </button>
        <button
          onClick={() => setActiveTab("trending")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-xs font-medium transition-all ${
            activeTab === "trending"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="hidden xs:block">Trending</span>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm">
        {activeTab === "people" && (
          <div className="p-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-blue-600" />
              People You May Know
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recommendations available
                  </p>
                )}
                {recommendations.slice(0, 6).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={
                        user.alumni_profile?.profile_picture_url ||
                        "https://i.pravatar.cc/150?u=" + user.id
                      }
                      alt={user.alumni_profile?.full_name || "User"}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm truncate">
                        {user.alumni_profile?.full_name || "Unknown User"}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {user.alumni_profile?.department} •{" "}
                        {user.alumni_profile?.graduation_year}
                      </p>
                      {user.recommendation_reason && (
                        <p className="text-xs text-blue-600 truncate">
                          {user.recommendation_reason}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => (window.location.href = `/users/${user.id}`)}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full mt-3 py-2 text-blue-600 font-medium text-xs border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              View All
            </button>
          </div>
        )}

        {activeTab === "communities" && (
          <div className="p-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-blue-600" />
              Your Communities
            </h3>
            <div className="space-y-3">
              {communitiesData.map((community) => (
                <div
                  key={community.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">
                      {community.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {community.members} members
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {community.isJoined && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✓
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-2 text-blue-600 font-medium text-xs border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-3 h-3" />
              Discover More
            </button>
          </div>
        )}

        {activeTab === "trending" && (
          <div className="p-4">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Trending Communities
            </h3>
            <div className="space-y-3">
              {trendingData.map((community) => (
                <div
                  key={community.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">
                      {community.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {community.members} members
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full block mb-1">
                      {community.growth}
                    </span>
                    <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnimatedWelcome({ user }) {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 animate-gradient-x opacity-80"></div>
      <div className="relative z-10 flex items-center gap-3 px-5 py-6">
        <div className="animate-bounce-slow">
          <Star className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-700 drop-shadow-sm flex items-center gap-2">
            Welcome back,
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-text">
              {user?.alumni_profile?.full_name || "Alumnus"}
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mt-1 font-medium animate-fade-in">
            Here’s what’s happening in your alumni network today.
          </p>
        </div>
      </div>
      {/* Subtle floating stars */}
      <div className="absolute top-2 right-6 animate-float">
        <Star className="w-6 h-6 text-purple-300 opacity-70" />
      </div>
      <div className="absolute bottom-2 left-8 animate-float-reverse">
        <Star className="w-5 h-5 text-pink-300 opacity-60" />
      </div>
      <style>
        {`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease-in-out infinite;
        }
        @keyframes gradient-text {
          0%,100% { filter: hue-rotate(0deg);}
          50% { filter: hue-rotate(30deg);}
        }
        .animate-gradient-text {
          animation: gradient-text 2.5s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.2s infinite;
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-10deg);}
          50% { transform: rotate(10deg);}
        }
        .animate-wiggle {
          animation: wiggle 1.2s infinite;
          display: inline-block;
        }
        @keyframes fade-in {
          from { opacity: 0;}
          to { opacity: 1;}
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease;
        }
        @keyframes float {
          0%,100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float 3s ease-in-out infinite reverse;
        }
        `}
      </style>
    </div>
  );
}

function Dashboard() {
  // 1. All state variables are declared at the top level.
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. A single useEffect hook to fetch all necessary data when the component mounts.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 3. Use Promise.all to run both API calls in parallel for better performance.
        const [profileResponse, postsResponse, communityResponse] =
          await Promise.all([
            apiClient.get("/profiles/me/"),
            apiClient.get("/posts/"),
            apiClient.get("/communities/"),
          ]);

        // Update the state
        setUser(profileResponse.data);
        setPosts(postsResponse.data);
        setCommunity(communityResponse.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard information.");
      } finally {
        // 6. Set loading to false once all calls are complete.
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // The empty dependency array ensures this effect runs only once.

  // Handle like/unlike post
  const handleLike = async (postId) => {
    try {
      // Find the post in the current posts array
      const post = posts.find((p) => p.id === postId);

      if (post.is_liked) {
        // Unlike the post
        await apiClient.delete(`/posts/${postId}/like/`);
      } else {
        // Like the post
        await apiClient.post(`/posts/${postId}/like/`);
      }

      // Update the posts state to reflect the like/unlike
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? {
                ...p,
                is_liked: !p.is_liked,
                likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to like/unlike post:", err);
      // Optionally show an error message to the user
    }
  };

  // --- A single, consolidated block for render logic ---

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <p>Loading Dashboard...</p>
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

  // This check prevents rendering errors if the API returns an empty object for either request.
  if (!user || !posts || !community) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <p>Could not load all dashboard components.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F8FA] min-h-screen">
      <main className="container mx-auto p-2 sm:p-4 lg:p-8">
        {/* Welcome Message */}
        <AnimatedWelcome user={user} />

        {/* Mobile Layout */}
        <div className="block sm:hidden">
          {/* Mobile Sections - ADD THIS HERE */}
          <MobileSections />

          {/* Mobile Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostDashboard
                key={post.id}
                id={post.id}
                authorName={post.author_name}
                authorId={post.author_id || post.author}
                created_at={post.created_at}
                content={post.content}
                title={post.title || ""}
                imageUrl={post.image_url}
                tags={post.tags || []}
                likesCount={post.likes_count}
                commentsCount={post.comments_count}
                isLiked={post.is_liked}
                community={post.community_name || ""}
                authorAvatar={post.author_profile_picture || ""}
              />
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid grid-cols-5 gap-8 items-start">
          <Sidebar
            profile_image={user.alumni_profile.profile_picture_url}
            full_name={user.alumni_profile.full_name}
            role={user.role}
            graduation_year={user.alumni_profile.graduation_year}
            department={user.alumni_profile.department}
          />
          <section className="col-span-3 space-y-6">
            {posts.map((post) => (
              <PostDashboard
                key={post.id}
                id={post.id}
                authorName={post.author_name}
                authorId={post.author_id || post.author}
                created_at={post.created_at}
                content={post.content}
                title={post.title || ""}
                imageUrl={post.image_url}
                tags={post.tags || []}
                likesCount={post.likes_count}
                commentsCount={post.comments_count}
                isLiked={post.is_liked}
                community={post.community_name || ""}
                authorAvatar={post.author_profile_picture || ""}
              />
            ))}
          </section>
          <Rightbar />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

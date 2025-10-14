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
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [trendingCommunities, setTrendingCommunities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all communities
        const communitiesResponse = await apiClient.get("/communities/");
        const allCommunities = communitiesResponse.data;

        // Separate joined and non-joined communities
        const joined = allCommunities.filter((community) => community.is_member);
        const notJoined = allCommunities.filter((community) => !community.is_member);

        // Sort joined communities by member count and take top 4
        const topJoined = joined
          .sort((a, b) => b.members_count - a.members_count)
          .slice(0, 4);

        // Sort trending (non-joined) by member count and take top 6
        const topTrending = notJoined
          .sort((a, b) => b.members_count - a.members_count)
          .slice(0, 6);

        setJoinedCommunities(topJoined);
        setTrendingCommunities(topTrending);

        // Fetch recommendations
        try {
          const recommendationsResponse = await apiClient.get("/profiles/recommendations/");
          setRecommendations(recommendationsResponse.data.results || []);
        } catch (recError) {
          console.log("Could not fetch recommendations:", recError);
          // Fallback mock data
          setRecommendations([
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
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch mobile data:", error);
        // Fallback mock data
        setJoinedCommunities([
          { id: "c1", name: "Entrepreneurship Hub", members_count: 1240 },
          { id: "c2", name: "AI & Machine Learning", members_count: 980 },
        ]);
        setTrendingCommunities([
          { id: "t1", name: "Bay Area Alumni", members_count: 2100 },
          { id: "t2", name: "Finance & Investing", members_count: 1750 },
          { id: "t3", name: "Campus Events", members_count: 2100 },
          { id: "t4", name: "Job Opportunities", members_count: 1850 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleJoinCommunity = async (communityId) => {
    try {
      await apiClient.post(`/communities/${communityId}/join/`);

      // Move community from trending to joined
      const communityToMove = trendingCommunities.find((c) => c.id === communityId);
      if (communityToMove) {
        setTrendingCommunities((prev) => prev.filter((c) => c.id !== communityId));
        setJoinedCommunities((prev) => {
          const updated = [...prev, { ...communityToMove, is_member: true }];
          return updated.slice(0, 4);
        });
      }
    } catch (error) {
      console.error("Failed to join community:", error);
    }
  };

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

      {/* Content - Using exact same styling as Rightbar */}
      <div className="bg-white rounded-xl shadow-sm">
        {activeTab === "people" && (
          <div className="p-6">
            <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">People You May Know</h4>
            {loading ? (
              <ul className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center justify-between gap-4 animate-pulse">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-gray-200 p-2 rounded-full flex-shrink-0 w-10 h-10"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-4">
                {recommendations.slice(0, 6).map((user) => (
                  <li key={user.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
                        <img
                          src={
                            user.alumni_profile?.profile_picture_url ||
                            "https://i.pravatar.cc/150?u=" + user.id
                          }
                          alt={user.alumni_profile?.full_name || "User"}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <a href={`/users/${user.id}`} className="font-medium text-dark-text hover:text-[#0077B5] block truncate">
                          {user.alumni_profile?.full_name || "Unknown User"}
                        </a>
                        <p className="text-xs text-light-text">
                          {user.alumni_profile?.department} • {user.alumni_profile?.graduation_year}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/users/${user.id}`}
                      className="text-xs font-semibold text-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#0077B5] hover:text-white transition-all flex-shrink-0"
                    >
                      View
                    </a>
                  </li>
                ))}
                {recommendations.length === 0 && (
                  <li className="text-center py-4">
                    <p className="text-light-text text-sm">No recommendations available</p>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        {activeTab === "communities" && (
          <div className="p-6">
            <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Your Communities</h4>
            <ul className="space-y-4">
              {joinedCommunities.map((community) => (
                <li key={community.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
                      <Users size={20} className="text-[#0077B5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={`/communities/${community.id}`} className="font-medium text-dark-text hover:text-[#0077B5] block truncate">
                        {community.name}
                      </a>
                      <p className="text-xs text-light-text">{community.members_count.toLocaleString()} members</p>
                    </div>
                  </div>
                  <a
                    href={`/communities/${community.id}`}
                    className="text-xs font-semibold text-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#0077B5] hover:text-white transition-all flex-shrink-0"
                  >
                    View
                  </a>
                </li>
              ))}
              {joinedCommunities.length === 0 && (
                <li className="text-center py-4">
                  <p className="text-light-text text-sm">You haven't joined any communities yet</p>
                </li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "trending" && (
          <div className="p-6">
            <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Trending Communities</h4>
            <ul className="space-y-4">
              {trendingCommunities.map((community) => (
                <li key={community.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="bg-gray-100 p-2 rounded-full flex-shrink-0">
                      <Users size={20} className="text-[#0077B5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a href={`/communities/${community.id}`} className="font-medium text-dark-text hover:text-[#0077B5] block truncate">
                        {community.name}
                      </a>
                      <p className="text-xs text-light-text">{community.members_count.toLocaleString()} members</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinCommunity(community.id)}
                    className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] transition-all flex-shrink-0"
                  >
                    Join
                  </button>
                </li>
              ))}
              {trendingCommunities.length === 0 && (
                <li className="text-center py-4">
                  <p className="text-light-text text-sm">No new communities to discover</p>
                </li>
              )}
            </ul>
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
      {/* <div className="relative z-10 flex items-center gap-3 px-5 py-6">
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
      </div> */}
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
            <div className="bg-white rounded-xl shadow-sm p-6 mb-2">
              <h2 className="text-2xl font-bold text-black mb-1">
                Welcome back, <span style={{ color: '#0077B5' }}>{user.alumni_profile.full_name?.split(' ')[0] || 'Alumnus'}</span>
              </h2>
              <p className="text-gray-700 text-base mt-1">
                Here’s what’s happening in your alumni network today.
              </p>
            </div>
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

import { useState, useEffect } from "react";
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
      <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 sm:grid-cols-5 gap-8 items-start">
        <Sidebar
          profile_image={user.alumni_profile.profile_picture_url}
          full_name={user.alumni_profile.full_name}
          role={user.role}
          graduation_year={user.alumni_profile.graduation_year}
          department={user.alumni_profile.department}
        />
        <section className="sm:col-span-3 space-y-6">
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
      </main>
    </div>
  );
}

export default Dashboard;

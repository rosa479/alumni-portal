import { useState, useEffect } from "react";
import Header from "../components/Header";
import Post from "../components/Post/Post";
import CreatePost from "../components/CreatePost";
import Sidebar from "../components/Sidebar";
import Rightbar from "../components/Rightbar";
import apiClient from "../interceptor";

// Mock data for the posts, which would normally come from your API
const postsData = [
  {
    id: 1,
    authorName: "Ankit Sharma",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    meta: 'posted in <a href="#" class="text-primary-blue hover:underline">Campus Events</a> • 2h ago',
    content:
      "So excited for the upcoming Alumni Meetup 2025 on campus! Who's planning to be there? It would be great to reconnect with old friends and make new connections. Let's make it a memorable one! 🎉",
  },
  {
    id: 2,
    authorName: "Priya Singh",
    authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    meta: 'posted in <a href="#" class="text-primary-blue hover:underline">Tech Careers</a> • 5h ago',
    content:
      "My team at Google is hiring Senior SDEs for our Bangalore office. The role involves working on large-scale distributed systems. KGP alumni referrals are highly encouraged. Feel free to DM me for details!",
  },
];

function Dashboard() {
  // 1. The user object is now a state variable, initialized to null.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 3. Send a GET request using the configured apiClient.
        const response = await apiClient.get("/api/profiles/me/");

        // 4. Print the received object to the console, as requested.
        console.log("Received Profile Data:", response.data);

        // 5. Update the user state with the data from the API response.
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Could not load profile information.");
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
  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 min-h-screen">
      <main className="container mx-auto p-4 lg:p-8 grid grid-cols-1 sm:grid-cols-5 gap-8 items-start">
        <Sidebar
          profile_image={user.alumni_profile.profile_picture_url}
          full_name={user.alumni_profile.full_name}
          role={user.role}
          graduation_year={user.alumni_profile.graduation_year}
          department={user.alumni_profile.department}
        />
        <section className="sm:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome to IITKGP Connect
            </h1>
            <p className="text-gray-600">
              Stay connected with your alma mater and fellow alumni
            </p>
          </div>
          <CreatePost />
          {postsData.map((post) => (
            <Post
              key={post.id}
              authorName={post.authorName}
              authorAvatar={post.authorAvatar}
              meta={post.meta}
              content={post.content}
            />
          ))}
        </section>
        <Rightbar />
      </main>
    </div>
  );
}

export default Dashboard;

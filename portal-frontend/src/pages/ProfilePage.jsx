// src/features/profile/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import VerificationAlert from "../components/Profile/VerificationAlert";
import ExperienceSection from "../components/Profile/ExperienceSection";
import EducationSection from "../components/Profile/EducationSection"; // <-- 1. Import Education
import SkillsSection from "../components/Profile/SkillsSection"; // <-- 2. Import Skills
import apiClient from "../interceptor";
import NetworkStatsSection from "../components/Profile/NetworkStat";

// We'll assume the user is pending verification for this example
const isVerified = false;

function ProfilePage() {
  // 1. The user object is now a state variable, initialized to null.
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. useEffect hook to fetch data when the component mounts.
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 3. Send a GET request using the configured apiClient.
        const response = await apiClient.get("/profiles/me/");

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
      <div className="bg-white p-6 rounded-xl text-center">
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // This check prevents rendering errors if the API returns an empty object
  if (!user) {
    return null;
  }

  return (
    <div className="bg-[#F5F8FA] min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        <ProfileHeader user={user} />

        {/* Conditionally render the alert */}
        {!isVerified && <VerificationAlert status={user.status} />}

        {/* --- 3. New Two-Column Layout --- */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Experience</h2>
              <ExperienceSection />
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Education</h2>
              <EducationSection user={user} />
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Network Stats</h2>
              <NetworkStatsSection user={user} />
            </div>
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Skills</h2>
              <SkillsSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

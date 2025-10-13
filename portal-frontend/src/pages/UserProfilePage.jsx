import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/Profile/ProfileHeader";
import VerificationAlert from "../components/Profile/VerificationAlert";
import ExperienceSection from "../components/Profile/ExperienceSection";
import EducationSection from "../components/Profile/EducationSection";
import SkillsSection from "../components/Profile/SkillsSection";
import apiClient from "../interceptor";
import NetworkStatsSection from "../components/Profile/NetworkStat";

function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/profiles/${userId}/`);
        setUser(response.data);
        // TODO: Fetch connection status
        // setIsConnected(response.data.is_connected);
      } catch (err) {
        setError("Could not load profile information.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const handleConnect = async () => {
    setConnectLoading(true);
    try {
      // TODO: Implement connect API
      // await apiClient.post(`/connections/${userId}/connect/`);
      setIsConnected(true);
    } catch (err) {
      // Optionally show error
    } finally {
      setConnectLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-white p-6 rounded-xl shadow-lg text-center"><p>Loading Profile...</p></div>;
  }
  if (error) {
    return <div className="bg-white p-6 rounded-xl shadow-lg text-center text-red-500"><p>{error}</p></div>;
  }
  if (!user) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between p-6 mb-8">
          <div className="flex items-center space-x-6 flex-1">
            <img
              src={user?.alumni_profile?.profile_picture_url}
              alt={user?.alumni_profile?.full_name}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {user?.alumni_profile?.full_name}
                </h2>
                {user?.status === "VERIFIED" && (
                  <span title="Verified" className="text-blue-500">
                    <svg className="w-6 h-6 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="text-lg text-gray-700">{user?.alumni_profile?.department}</div>
              <div className="text-gray-500">Class of {user?.alumni_profile?.graduation_year}</div>
              {user?.alumni_profile?.about_me && (
                <div className="italic text-gray-600 mt-2">
                  &quot;{user.alumni_profile.about_me}&quot;
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8 flex flex-col items-end">
            <div className="bg-gray-50 border rounded-xl px-8 py-4 text-center mb-4 w-56">
              <div className="font-bold text-lg mb-1">LEGACY SCORE</div>
              <div className="text-3xl font-extrabold text-gray-800 mb-1">{user?.alumni_profile?.credit_score || 0}</div>
              <div className="text-sm text-gray-600 mb-2">
                <span role="img" aria-label="medal">🏅</span> Community Pillar
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: "0%" }} />
              </div>
              <div className="text-xs text-gray-400">1000 points to next rank</div>
            </div>
            <button
              className={`px-6 py-2 rounded-lg font-semibold border transition-all text-blue-600 border-blue-600 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed`}
              onClick={handleConnect}
              disabled={isConnected || connectLoading}
            >
              {isConnected ? 'Connected' : connectLoading ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ExperienceSection />
            <EducationSection user={user} />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <NetworkStatsSection user={user} />
            <SkillsSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;

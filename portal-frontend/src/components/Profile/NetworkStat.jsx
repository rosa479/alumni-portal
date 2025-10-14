// src/features/profile/components/NetworkStatsSection.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../../interceptor";

// The component now accepts the 'user' object as a prop
function NetworkStatsSection({ user }) {
  const [stats, setStats] = useState({
    communitiesCount: 0,
    postsCount: 0,
    legacyScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Use the dedicated stats endpoint for accurate data
      const res = await apiClient.get("/profiles/me/stats/");
      setStats({
        communitiesCount: res.data.communities_joined || 0,
        postsCount: res.data.posts_created || 0,
        legacyScore: res.data.credit_points || 0,
      });
    } catch (error) {
      // fallback to user object if API fails
      setStats({
        communitiesCount: user?.joined_communities_count || 0,
        postsCount: user?.posts_count || 0,
        legacyScore: user?.credit_points || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-dark-text mb-4">Your Network</h3>

        <p className="text-gray-600 mb-6">
          An overview of your contributions and connections within the alumni
          network.
        </p>

        {/* Container for the stats */}
        <div className="space-y-4">
          {/* Loading states */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Communities Joined</span>
            <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Posts Created</span>
            <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Legacy Score</span>
            <div className="w-8 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Exact same UI - no changes to styling or structure
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-dark-text mb-4">Your Network</h3>

      <p className="text-gray-600 mb-6">
        An overview of your contributions and connections within the alumni
        network.
      </p>

      {/* Container for the stats */}
      <div className="space-y-4">
        {/* Communities Joined Stat */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Communities Joined</span>
          <span className="font-bold text-blue-800 text-lg">
            {stats.communitiesCount}
          </span>
        </div>

        {/* Posts Created Stat */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Posts Created</span>
          <span className="font-bold text-blue-800 text-lg">
            {stats.postsCount}
          </span>
        </div>

        {/* Legacy Score Stat */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Legacy Score</span>
          <span className="font-bold text-blue-800 text-lg">
            {stats.legacyScore}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NetworkStatsSection;

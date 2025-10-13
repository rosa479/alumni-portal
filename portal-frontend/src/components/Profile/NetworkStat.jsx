// src/features/profile/components/NetworkStatsSection.jsx
import React from "react";

// The component now accepts the 'user' object as a prop
function NetworkStatsSection({ user }) {
  // Use optional chaining (?.) and the nullish coalescing operator (??)
  // to prevent errors if the user object or its properties are still loading.
  const communitiesCount = user?.joined_communities?.length ?? 0;
  const postsCount = user?.posts?.length ?? 0;
  const legacyScore = user?.credit_points ?? 0;

  return (
    // Replicating the style of the "About Community" section
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-dark-text mb-4">Your Network</h3>

      <p className="text-gray-600 mb-6">
        An overview of your endowment and connections within the alumni
        network.
      </p>

      {/* Container for the stats */}
      <div className="space-y-4">
        {/* Communities Joined Stat */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Communities Joined</span>
          <span className="font-bold text-blue-800 text-lg">
            {communitiesCount}
          </span>
        </div>

        {/* Posts Created Stat */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Posts Created</span>
          <span className="font-bold text-blue-800 text-lg">{postsCount}</span>
        </div>

        {/* Legacy Score Stat */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Legacy Score</span>
          <span className="font-bold text-blue-800 text-lg">{legacyScore}</span>
        </div>
      </div>
    </div>
  );
}

export default NetworkStatsSection;

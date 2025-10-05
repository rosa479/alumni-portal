// src/features/communities/components/CommunityHeader.jsx
import React from 'react';
import { Users, Rss } from 'react-feather';

// This component receives the specific community's data as a prop
function CommunityHeader({ community }) {
  if (!community) return null; // Don't render if no community data

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h1 className="text-4xl font-bold text-primary-blue">{community.name}</h1>
      <p className="text-md text-light-text mt-2">{community.description}</p>
      <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-dark-text">
          <Users size={16} />
          <span className="font-semibold">{community.members.toLocaleString()} Members</span>
        </div>
        <div className="flex items-center gap-2 text-dark-text">
          <Rss size={16} />
          <span className="font-semibold">{community.posts.length} Posts</span>
        </div>
        <button className="ml-auto bg-primary-blue text-white font-semibold py-2 px-5 rounded-full hover:bg-opacity-90 transition-all">
          Join Community
        </button>
      </div>
    </div>
  );
}

export default CommunityHeader;
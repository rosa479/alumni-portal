// src/features/communities/CommunitiesPage.jsx
import React from 'react';
import { Search } from 'react-feather';
import CommunityCard from '../components/CommunityCard';

// Mock data, which would come from your API
const communities = [
  { id: 1, name: 'Entrepreneurship Hub', description: 'Connect with founders, investors, and mentors in the KGP network.', members: 1250 },
  { id: 2, name: 'AI & Machine Learning', description: 'Discussions on the latest trends, research, and career opportunities in AI/ML.', members: 2800 },
  { id: 3, name: 'Bay Area Alumni', description: 'A local chapter for alumni living and working in the San Francisco Bay Area.', members: 850 },
  { id: 4, name: 'Finance & Investing', description: 'A community for professionals in banking, private equity, and venture capital.', members: 975 },
  { id: 5, name: 'Research & Academia', description: 'Connecting KGPians pursuing careers in academic and industrial research.', members: 640 },
  { id: 6, name: "KGP '08 Batch", description: 'A private group for the graduating class of 2008 to reconnect and network.', members: 215 },
];

function CommunitiesPage() {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* Page Header and Search */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark-text mb-2">Discover Communities</h1>
        <p className="text-lg text-light-text">Find and join groups that match your interests and professional goals.</p>
        <div className="relative mt-6 max-w-lg">
          <input
            type="text"
            placeholder="Search for communities..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-blue focus:outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {communities.map(community => (
          <CommunityCard
            key={community.id}
            id={community.id}
            name={community.name}
            description={community.description}
            members={community.members}
          />
        ))}
      </div>
    </div>
  );
}

export default CommunitiesPage;
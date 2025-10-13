// src/components/Rightbar.jsx
import React from 'react';
import { Users } from 'react-feather';

function Rightbar() {
  const yourCommunities = [
    { id: 'c1', name: 'Entrepreneurship Hub', members_count: 1240 },
    { id: 'c2', name: 'AI & Machine Learning', members_count: 980 },
    { id: 'c3', name: 'Entrepreneurship Hub', members_count: 1240 },
    { id: 'c4', name: 'AI & Machine Learning', members_count: 980 },
  ];

  const trendingCommunities = [
    { id: 't1', name: 'Bay Area Alumni', members_count: 2100 },
    { id: 't2', name: 'Finance & Investing', members_count: 1750 },
    { id: 't3', name: 'Research, Innovation, and Academia Collaboration', members_count: 1600 }, // A long name for testing
    { id: 't4', name: 'Bay Area Alumni', members_count: 2100 },
    { id: 't5', name: 'Finance & Investing', members_count: 1750 },
    { id: 't6', name: 'Research, Innovation, and Academia Collaboration', members_count: 1600 },
  ];

  return (
    <aside className="hidden lg:block sticky top-27">
      {/* --- Your Communities Card --- */}
      <div className="bg-white p-6 rounded-xl mb-6">
        <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Your Communities</h4>
        <ul className="space-y-4">
          {yourCommunities.map((community) => (
            <li key={community.id} className="flex items-center justify-between gap-4">
              {/* Content wrapper that can grow */}
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
              {/* Button with fixed shrink size */}
              <a 
                href={`/communities/${community.id}`}
                className="text-xs font-semibold text-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#0077B5] hover:text-white transition-all flex-shrink-0"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Trending Communities Card --- */}
      <div className="bg-white p-6 rounded-xl">
        <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Trending Communities</h4>
        <ul className="space-y-4">
          {trendingCommunities.map((community) => (
            <li key={community.id} className="flex items-center justify-between gap-4">
              {/* Content wrapper */}
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
              {/* Button */}
              <button className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] transition-all flex-shrink-0">
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Rightbar;
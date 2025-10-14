// src/components/Rightbar.jsx
import React, { useState, useEffect } from 'react';
import { Users } from 'react-feather';
import apiClient from '../interceptor';

function Rightbar() {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [trendingCommunities, setTrendingCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all communities
        const communitiesResponse = await apiClient.get("/communities/");
        const allCommunities = communitiesResponse.data;

        // Separate joined and non-joined communities
        const joined = allCommunities.filter(community => community.is_member);
        const notJoined = allCommunities.filter(community => !community.is_member);

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

      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
        // Fallback to mock data if API fails
        setJoinedCommunities([
          { id: 'c1', name: 'Entrepreneurship Hub', members_count: 1240 },
          { id: 'c2', name: 'AI & Machine Learning', members_count: 980 },
          { id: 'c3', name: 'Tech Careers', members_count: 1240 },
          { id: 'c4', name: 'Alumni Network', members_count: 980 },
        ]);
        setTrendingCommunities([
          { id: 't1', name: 'Bay Area Alumni', members_count: 2100 },
          { id: 't2', name: 'Finance & Investing', members_count: 1750 },
          { id: 't3', name: 'Research, Innovation, and Academia Collaboration', members_count: 1600 },
          { id: 't4', name: 'Campus Events', members_count: 2100 },
          { id: 't5', name: 'Entrepreneurship', members_count: 1750 },
          { id: 't6', name: 'Job Opportunities', members_count: 1600 },
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
      const communityToMove = trendingCommunities.find(c => c.id === communityId);
      if (communityToMove) {
        setTrendingCommunities(prev => prev.filter(c => c.id !== communityId));
        setJoinedCommunities(prev => {
          const updated = [...prev, { ...communityToMove, is_member: true }];
          return updated.slice(0, 4); // Keep only top 4
        });
      }
    } catch (error) {
      console.error("Failed to join community:", error);
    }
  };

  // Show loading with same styling
  if (loading) {
    return (
      <aside className="hidden lg:block sticky top-27">
        <div className="bg-white p-6 rounded-xl mb-6">
          <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Your Communities</h4>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-gray-200 p-2 rounded-full flex-shrink-0 w-10 h-10"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl">
          <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Trending Communities</h4>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex items-center justify-between gap-4 animate-pulse">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="bg-gray-200 p-2 rounded-full flex-shrink-0 w-10 h-10"></div>
                  <div className="flex-1 min-w-0">
                    <div className="h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    );
  }

  // Exact same JSX as your original design - no styling changes
  return (
    <aside className="hidden lg:block sticky top-27">
      {/* --- Your Communities Card --- */}
      <div className="bg-white p-6 rounded-xl mb-6">
        <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Your Communities</h4>
        <ul className="space-y-4">
          {joinedCommunities.map((community) => (
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
          {joinedCommunities.length === 0 && (
            <li className="text-center py-4">
              <p className="text-light-text text-sm">You haven't joined any communities yet</p>
            </li>
          )}
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
    </aside>
  );
}

export default Rightbar;
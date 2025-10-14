// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../interceptor";

function Sidebar({
  profile_image,
  full_name,
  role,
  graduation_year,
  department,
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await apiClient.get('/profiles/recommendations/');
        setRecommendations(response.data.results || []);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        // Fallback to mock data if API fails
        setRecommendations([
          { id: 1, alumni_profile: { full_name: 'Riya Mehta', department: 'CSE', graduation_year: 2020, profile_picture_url: 'https://i.pravatar.cc/150?img=1' }, recommendation_reason: 'Same department' },
          { id: 2, alumni_profile: { full_name: 'Arjun Verma', department: 'EE', graduation_year: 2019, profile_picture_url: 'https://i.pravatar.cc/150?img=2' }, recommendation_reason: 'Close batch mate' },
          { id: 3, alumni_profile: { full_name: 'Neha Gupta', department: 'ME', graduation_year: 2018, profile_picture_url: 'https://i.pravatar.cc/150?img=3' }, recommendation_reason: 'Fellow alumni' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleConnect = async (userId) => {
    try {
      // You can implement a connection/follow system here
      console.log('Connecting with user:', userId);
      // For now, just navigate to their profile
      window.location.href = `/users/${userId}`;
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <aside className="hidden lg:block sticky top-27">
      <div className="bg-white p-6 rounded-xl text-center mb-6">
        <img
          src={profile_image}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[#0077B5]"
        />
        <h3 className="text-lg font-bold text-[#0077B5]">{full_name}</h3>
        <p className="text-sm text-light-text">{role}</p>
        <p className="text-sm text-light-text">
          Class of {graduation_year}, {department}
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl">
        <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">
          People you may know
        </h4>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {recommendations.slice(0, 6).map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img 
                    src={user.alumni_profile?.profile_picture_url || 'https://i.pravatar.cc/150?u=' + user.id} 
                    alt={user.alumni_profile?.full_name || 'User'} 
                    className="w-9 h-9 rounded-full flex-shrink-0" 
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-dark-text truncate">
                      {user.alumni_profile?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-light-text truncate">
                      {user.alumni_profile?.department} • {user.alumni_profile?.graduation_year}
                    </p>
                    {user.recommendation_reason && (
                      <p className="text-xs text-blue-600 truncate">
                        {user.recommendation_reason}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleConnect(user.id)}
                  className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] hover:text-white transition-all flex-shrink-0 ml-2"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {!loading && recommendations.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No recommendations available
          </p>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

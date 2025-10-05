// src/features/communities/components/CommunityCard.jsx
import React from 'react';
import { Users } from 'react-feather';
import { Link } from 'react-router-dom'; // <-- 1. Import Link

// Add `id` to the props
function CommunityCard({ id, name, description, members }) { 
  return (
    // 2. Wrap the entire card in a Link component
    <Link to={`/communities/${id}`} className="block"> 
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-full transition-transform transform hover:-translate-y-1">
        {/* ... (rest of the card content remains the same) ... */}
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-primary-blue mb-2">{name}</h3>
          <p className="text-light-text text-sm mb-4">{description}</p>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-light-text">
            <Users size={16} />
            <span className="text-sm font-medium">{members.toLocaleString()} members</span>
          </div>
          <span className="text-sm font-semibold text-primary-blue border border-primary-blue rounded-full px-4 py-1 hover:bg-primary-blue hover:text-white transition-all">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CommunityCard;
// src/features/communities/components/CommunityCard.jsx
import React from "react";
import { Users} from "react-feather"; // You can change 'Users' to any icon you prefer
import { Link } from "react-router-dom";

function CommunityCard({ id, name, description, members }) {
  return (
    <Link to={`/communities/${id}`} className="block">
      <div className="bg-white rounded-xl p-6 flex flex-col h-full border border-gray-200 transition-transform transform hover:-translate-y-1">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <Users size={32} className="text-[#0077B5]" />
          <h3 className="text-xl font-bold text-[#0077B5]">{name}</h3>
        </div>

        {/* Description */}
        <div className="flex-grow">
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <Users size={16} />
            <span className="text-sm font-medium">
              {members.toLocaleString()} members
            </span>
          </div>
          <span className="text-sm font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-4 py-1 hover:bg-[#006097] transition-all">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CommunityCard;

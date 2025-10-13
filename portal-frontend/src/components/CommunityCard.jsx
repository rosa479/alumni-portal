// src/features/communities/components/CommunityCard.jsx
import React from "react";
import { Users } from "react-feather";
import { Link } from "react-router-dom";

// 🖼️ Import your community images
import entrepreneurship from "./icons/enterpreneurship.png";
import ai from "./icons/ai.png";
import finance from "./icons/invest.png";
import research from "./icons/research.png";
import place from "./icons/place.png";
import graduate from "./icons/graduate.png";

// 🧩 Map community keywords to their images
const communityImages = {
  entrepreneurship: entrepreneurship,
  business: entrepreneurship,
  startup: entrepreneurship,

  ai: ai,

  finance: finance,
  investing: finance,
  investment: finance, 

  research: research,
  academia: research,
  academic: research,

  "bay area": place,
  "san francisco": place,
  "silicon valley": place,  

  "kharagpur": graduate,
  "alumni": graduate,
  "batch": graduate,

};

// 🔍 Helper to find an image based on community name
const getCommunityImage = (name) => {
  const lower = name.toLowerCase();
  for (const key in communityImages) {
    if (lower.includes(key)) {
      return communityImages[key];
    }
  }
  return null; // fallback to Users icon
};

function CommunityCard({ id, name, description, members }) {
  const communityImage = getCommunityImage(name);

  return (
    <Link to={`/communities/${id}`} className="block">
      <div className="bg-white rounded-xl p-6 flex flex-col h-full border border-gray-200 transition-transform transform hover:-translate-y-1">
        
        {/*  Image or Default Icon */}
        <div className="flex items-center gap-3 mb-3">
          {communityImage ? (
            <img
              src={communityImage}
              alt={name}
              className="w-8 h-8 object-contain rounded-md"
            />
          ) : (
            <Users size={32} className="text-[#0077B5]" />
          )}
          <h3 className="text-xl font-bold text-black-800">{name}</h3>
        </div>

        {/*  Description */}
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

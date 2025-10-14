// src/features/communities/components/CommunityCard.jsx
import React, { useState } from "react";
import { Users } from "react-feather";
import { Link } from "react-router-dom";
import apiClient from "../interceptor";

// Import your community images
import entrepreneurship from "./icons/enterpreneurship.png";
import ai from "./icons/ai.png";
import finance from "./icons/invest.png";
import research from "./icons/research.png";
import place from "./icons/place.png";
import graduate from "./icons/graduate.png";

// Map community keywords to their images
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

function CommunityCard({ id, name, description, members, is_member = false }) {
  const communityImage = getCommunityImage(name);
  const [isMember, setIsMember] = useState(is_member);
  const [membersCount, setMembersCount] = useState(members);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleJoinLeave = async () => {
    setIsLoading(true);
    try {
      if (isMember) {
        await apiClient.delete(`/communities/${id}/leave/`);
        setIsMember(false);
        setMembersCount(prev => prev - 1);
      } else {
        await apiClient.post(`/communities/${id}/join/`);
        setIsMember(true);
        setMembersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to update membership:', error);
      alert('Failed to update membership. Please try again.');
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMember) {
      setShowModal(true);
    } else {
      handleJoinLeave();
    }
  };

  return (
    <>
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
                {membersCount.toLocaleString()} members
              </span>
            </div>
            <button
              onClick={handleButtonClick}
              disabled={isLoading}
              className={`text-sm font-semibold border rounded-full px-4 py-1 transition-all ${
                isMember
                  ? 'text-white bg-red-600 border-red-600 hover:bg-red-600 hover:cursor-pointer'
                  : 'text-white bg-[#0077B5] border-[#0077B5] hover:bg-[#006097] hover:cursor-pointer'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? '...' : (isMember ? 'Exit' : 'Join')}
            </button>
          </div>
        </div>
      </Link>

      {/* Modal for Exit Confirmation */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(243,244,246,0.85)" }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-red-700">Are you sure you want to exit?</h2>
            <p className="mb-6 text-gray-700">
              If you exit this community, you will lose access to its posts and updates.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinLeave}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Exiting..." : "Exit Community"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommunityCard;

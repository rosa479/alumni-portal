// src/features/communities/components/CommunityHeader.jsx
import React, { useState } from "react";
import { Users, Rss } from "react-feather";

// This component receives the specific community's data as a prop
function CommunityHeader({ community, isMember, membersCount, onJoinLeave }) {
  const [showModal, setShowModal] = useState(false);

  if (!community) return null; // Don't render if no community data

  const handleExitClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmExit = () => {
    setShowModal(false);
    onJoinLeave();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-4xl font-bold text-primary-blue">{community.name}</h1>
        <p className="text-md text-light-text mt-2">{community.description}</p>
        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-dark-text">
            <Users size={16} />
            <span className="font-semibold">
              {membersCount || community.members_count} Members
            </span>
          </div>
          <div className="flex items-center gap-2 text-dark-text">
            <Rss size={16} />
            <span className="font-semibold">{community.posts_count} Posts</span>
          </div>
          <div className="flex-1" />
          {isMember ? (
            <button
              onClick={handleExitClick}
              className="min-w-[160px] font-semibold py-2 px-5 rounded-full transition-all shadow-sm text-center border border-red-600 text-red-600 hover:bg-red-700 hover:text-white cursor-pointer"
              style={{ marginLeft: "auto" }}
            >
              Exit
            </button>
          ) : (
            <button
              onClick={onJoinLeave}
              className="min-w-[160px] font-semibold py-2 px-5 rounded-full transition-all shadow-sm text-center bg-blue-600 text-white hover:bg-blue-700"
              style={{ marginLeft: "auto" }}
            >
              Join Community
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(243, 244, 246, 0.85)" }} // gray-100 with opacity
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
                onClick={handleConfirmExit}
                className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 font-semibold"
              >
                Exit Community
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommunityHeader;

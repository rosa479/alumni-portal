// src/components/Profile/ProfileHeader.jsx
import React from "react";
import { Edit } from "react-feather";
import apiClient from "../../interceptor";

function ProfileHeader({ user }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* Main container to position user info and impact card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* --- User Info Section (No changes here) --- */}
        <div className="flex flex-col md:flex-row items-center gap-6 flex-grow">
          <img
            src={
              user.alumni_profile.profile_picture_url ||
              "https://i.pravatar.cc/150"
            }
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-primary-blue object-cover"
          />
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-dark-text">
              {user.alumni_profile.full_name}
            </h1>
            <p className="text-lg text-light-text mt-1">
              {user.alumni_profile.department}
            </p>
            <p className="text-md text-light-text mt-2">
              Class of {user.alumni_profile.graduation_year}
            </p>
            <p className="text-base text-gray-600 mt-3 italic">
              {`"${user.alumni_profile.about_me}"`}
            </p>
          </div>
        </div>

{/* --- START: Dashing Impact Card --- */}
<div className="bg-gradient-to-br from-slate-800 to-gray-900 text-white p-6 rounded-xl shadow-2xl w-full md:w-auto md:min-w-[320px] flex flex-col justify-between">
  {/* Header Title */}
  <h3 className="text-sm font-semibold text-gray-400 tracking-wider text-center mb-4">
    LEGACY SCORE
  </h3>

    {/* Main Score and Rank */}
    <div className="text-center">
      <p className="text-6xl font-bold">
        3,480
      </p>
      <p className="font-semibold text-xl text-gray-200 mt-2 flex items-center justify-center gap-2">
        Distinguished Benefactor
        <span className="text-yellow-400 text-lg">🌾</span> {/* Icon/Emoji */}
      </p>
    </div>

    {/* Progress Section */}
    <div className="mt-8">
      <p className="text-xs text-gray-400 text-center mb-2">
        1,520 points to next rank
      </p>
      {/* Progress Bar Track */}
      <div className="bg-gray-700 rounded-full h-2.5 w-full">
        {/* Progress Bar Fill with Gradient */}
        <div
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 h-2.5 rounded-full"
          style={{ width: "70%" }} // Dummy progress
        ></div>
      </div>
    </div>
  </div>
{/* --- END: Dashing Impact Card --- */}
      </div>
    </div>
  );
}

export default ProfileHeader;
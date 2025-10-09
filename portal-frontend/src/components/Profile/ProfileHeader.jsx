// src/components/Profile/ProfileHeader.jsx
import React from "react";
// 1. Import the CheckCircle icon from react-feather
import { CheckCircle } from "react-feather";

function ProfileHeader({ user }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* Main container to position user info and impact card */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* --- User Info Section --- */}
        <div className="flex flex-col md:flex-row items-center gap-6 flex-grow">
          <img
            src={
              user.alumni_profile.profile_picture_url ||
              "https://i.pravatar.cc/150"
            }
            alt={user.alumni_profile.full_name}
            className="w-32 h-32 rounded-full border-4 border-primary-blue object-cover"
          />
          <div className="flex-grow text-center md:text-left">
            {/* 2. Create a flex container to align the name and the tick */}
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-3xl font-bold text-dark-text">
                {user.alumni_profile.full_name}
              </h1>
              {/* 3. Conditionally render the blue tick if user is verified */}
              {user.status === "VERIFIED" && (
                <CheckCircle className="w-6 h-6 text-primary-blue" />
              )}
            </div>

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

        {/* --- START: New MVP Impact Card --- */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 w-full md:w-auto md:min-w-[280px] text-center">
          <h3 className="text-sm font-bold text-dark-text mb-2">
            LEGACY SCORE
          </h3>

          {/* Score and Rank */}
          <div className="mb-4">
            <p className="text-4xl font-bold text-primary-blue">
              {user.credit_points}
            </p>
            <p className="font-semibold text-lg text-dark-text mt-1">
              🏅 Community Pillar
            </p>
          </div>

          {/* Progress Bar */}
          <div>
            <p className="text-xs text-light-text mb-1">
              {1000 - parseInt(user.credit_points)} points to next rank
            </p>
            <div className="bg-gray-200 rounded-full h-2 w-full">
              <div
                className="bg-primary-blue h-2 rounded-full"
                style={{ width: "82%" }} // Dummy progress
              ></div>
            </div>
          </div>
        </div>
        {/* --- END: New MVP Impact Card --- */}
      </div>
    </div>
  );
}

export default ProfileHeader;

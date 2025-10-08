import React from "react";
import { Edit } from "react-feather";
import apiClient from "../../interceptor";

function ProfileHeader({ user }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-6">
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
          {/* About Me line */}
          <p className="text-base text-gray-600 mt-3 italic">
            {`"${user.alumni_profile.about_me}"`}
          </p>
        </div>

        {/* <button className="flex items-center gap-2 bg-primary-blue text-black font-semibold py-2 px-5 rounded-full hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5">
          <Edit size={16} />
          <span>Edit Profile</span>
        </button> */}
      </div>
    </div>
  );
}

export default ProfileHeader;

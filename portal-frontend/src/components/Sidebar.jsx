// src/components/Sidebar.jsx
import React from "react";

function Sidebar({
  profile_image,
  full_name,
  role,
  graduation_year,
  department,
}) {
  return (
    <aside className="hidden lg:block">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center mb-6">
        <img
          src={profile_image}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary-blue"
        />
        <h3 className="text-lg font-bold text-primary-blue">{full_name}</h3>
        <p className="text-sm text-light-text">{role}</p>
        <p className="text-sm text-light-text">
          Class of {graduation_year}, {department}
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              My Feed
            </a>
          </li>
          <li>
            <a
              href="/profile"
              className="block py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              My Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Messages
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Events
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;

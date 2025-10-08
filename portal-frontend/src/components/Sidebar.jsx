// src/components/Sidebar.jsx
import React from "react";

function Sidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center mb-6">
        <img
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary-blue"
        />
        <h3 className="text-lg font-bold text-primary-blue">John Doe</h3>
        <p className="text-sm text-light-text">Senior Software Engineer</p>
        <p className="text-sm text-light-text">
          Class of 2018, Computer Science
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

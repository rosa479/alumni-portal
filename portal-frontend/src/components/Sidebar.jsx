// src/components/Sidebar.jsx
import React, { useState } from "react";

function Sidebar({
  profile_image,
  full_name,
  role,
  graduation_year,
  department,
  unreadMessages = 5, // Add this prop for unread messages count
}) {
  // Track active menu item
  const [active, setActive] = useState("feed");

  const menu = [
    { key: "feed", label: "My Feed", href: "#" },
    { key: "profile", label: "My Profile", href: "/profile" },
    { key: "messages", label: "Messages", href: "#" },
    { key: "events", label: "Events", href: "#" },
  ];

  return (
    <aside className="hidden lg:block">
      <div className="bg-white p-6 rounded-xl text-center mb-6">
        <img
          src={profile_image}
          alt="Profile"
          className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[#0077B5]"
        />
        <h3 className="text-lg font-bold text-[#0077B5]">{full_name}</h3>
        <p className="text-sm text-light-text">{role}</p>
        <p className="text-sm text-light-text">
          Class of {graduation_year}, {department}
        </p>
      </div>
      <div className="bg-white p-6 rounded-xl ">
        <ul className="space-y-2">
          {menu.map((item) => (
            <li key={item.key} className="relative">
              <a
                href={item.href}
                onClick={() => setActive(item.key)}
                className={`block py-2 px-4 rounded-lg font-medium transition-colors ${
                  active === item.key
                    ? "bg-[#0077B5] text-white"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
              >
                {item.label}
                {item.key === "messages" && unreadMessages > 0 && (
                  <span className="absolute top-2 right-4 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-orange-200 text-orange-700">
                    {unreadMessages}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;

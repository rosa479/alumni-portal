// src/components/Sidebar.jsx
import React from "react";

function Sidebar({
  profile_image,
  full_name,
  role,
  graduation_year,
  department,
}) {
  const suggestions = [
    { id: 1, name: 'Riya Mehta', dept: 'CSE • 2020', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Arjun Verma', dept: 'EE • 2019', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, name: 'Neha Gupta', dept: 'ME • 2018', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 4, name: 'Riya Mehta', dept: 'CSE • 2020', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 5, name: 'Arjun Verma', dept: 'EE • 2019', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 6, name: 'Neha Gupta', dept: 'ME • 2018', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 7, name: 'Riya Mehta', dept: 'CSE • 2020', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 8, name: 'Arjun Verma', dept: 'EE • 2019', avatar: 'https://i.pravatar.cc/150?img=2' },
  ];

  return (
    <aside className="hidden lg:block sticky top-27">
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
        <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">People you may know</h4>
        <ul className="space-y-4">
          {suggestions.map((p) => (
            <li key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full" />
                <div>
                  <p className="font-medium text-dark-text">{p.name}</p>
                  <p className="text-xs text-light-text">{p.dept}</p>
                </div>
              </div>
              <button className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] hover:text-white transition-all">Connect</button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;

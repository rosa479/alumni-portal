// src/components/Rightbar.jsx
import React from 'react';

function Rightbar() {
  return (
    <aside className="hidden lg:block">
      <div className="bg-white p-6 rounded-xl ">
        <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Trending Communities</h4>
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">Entrepreneurship</a>
            <button className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] hover:text-white transition-all">Join</button>
          </li>
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">Research & Innovation</a>
            <button className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] hover:text-white transition-all">Join</button>
          </li>
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">AI & Machine Learning</a>
            <button className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] hover:text-white transition-all">Join</button>
          </li>
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">Social Impact</a>
            <button className="text-xs font-semibold text-white bg-[#0077B5] border border-[#0077B5] rounded-full px-3 py-1 hover:bg-[#005983] hover:text-white transition-all">Join</button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Rightbar;
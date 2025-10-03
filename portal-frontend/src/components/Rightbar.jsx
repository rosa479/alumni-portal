// src/components/Rightbar.jsx
import React from 'react';

function Rightbar() {
  return (
    <aside className="hidden lg:block">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h4 className="font-bold text-dark-text mb-4 pb-3 border-b border-gray-200">Trending Communities</h4>
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">Entrepreneurship</a>
            <button className="text-xs font-semibold text-primary-blue border border-primary-blue rounded-full px-3 py-1 hover:bg-blue-500 hover:text-white transition-all">Join</button>
          </li>
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">Research & Innovation</a>
            <button className="text-xs font-semibold text-primary-blue border border-primary-blue rounded-full px-3 py-1 hover:bg-blue-500 hover:text-white transition-all">Join</button>
          </li>
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">AI & Machine Learning</a>
            <button className="text-xs font-semibold text-primary-blue border border-primary-blue rounded-full px-3 py-1 hover:bg-blue-500 hover:text-white transition-all">Join</button>
          </li>
          <li className="flex justify-between items-center">
            <a href="#" className="font-medium hover:text-primary-blue">Social Impact</a>
            <button className="text-xs font-semibold text-primary-blue border border-primary-blue rounded-full px-3 py-1 hover:bg-blue-500 hover:text-white transition-all">Join</button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Rightbar;
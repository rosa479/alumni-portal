// src/components/CreatePost.jsx
import React from 'react';

function CreatePost() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex items-start gap-4">
      <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="My Profile" className="w-12 h-12 rounded-full" />
      <div className="w-full">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:outline-none transition"
          placeholder="Share something with your alumni network..."
          rows="3"
        ></textarea>
        <div className="flex justify-end mt-3">
          <button className="bg-primary-blue text-white font-semibold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
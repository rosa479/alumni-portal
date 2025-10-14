// src/features/posts/components/Comment.jsx

import React from "react";
import { Link } from "react-router-dom";

const Comment = ({ authorName, authorAvatar, authorId, text, time }) => {
  return (
    <div className="flex items-start space-x-3 py-3 border-b last:border-0">
      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
        {authorAvatar ? (
          <img src={authorAvatar} alt={authorName} className="w-full h-full rounded-full" />
        ) : (
          authorName?.charAt(0).toUpperCase() || "U"
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <Link 
            to={`/users/${authorId}`}
            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {authorName || "Anonymous"}
          </Link>
          <span className="text-xs text-gray-500">
            {time}
          </span>
        </div>
        <p className="text-gray-700 text-sm mt-1">{text}</p>
      </div>
    </div>
  );
};

export default Comment;
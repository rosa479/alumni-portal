// src/features/posts/components/Comment.jsx
import React from 'react';

function Comment({ authorName, authorAvatar, text, time }) {
  return (
    <div className="flex items-start gap-4">
      <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full" />
      <div className="flex-1 bg-gray-100 p-4 rounded-xl">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-dark-text">{authorName}</span>
          <span className="text-xs text-light-text">{time}</span>
        </div>
        <p className="text-dark-text mt-1">{text}</p>
      </div>
    </div>
  );
}

export default Comment;
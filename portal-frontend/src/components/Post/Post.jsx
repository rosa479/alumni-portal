// src/components/Post.jsx
import React from 'react';
import { ThumbsUp, MessageSquare, Share2 } from 'react-feather';
import { Link } from 'react-router-dom'; // <-- 1. Import Link

// Add `id` as a prop
function Post({ id, authorName, authorAvatar, meta, content }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* ... (Post header and content remain the same) ... */}
       <div className="flex items-center gap-4">
        <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full" />
        <div>
          <span className="font-semibold text-dark-text">{authorName}</span>
          <p className="text-xs text-light-text" dangerouslySetInnerHTML={{ __html: meta }} />
        </div>
      </div>
       {/* 2. Wrap the content in a Link */}
      <Link to={`/posts/${id}`} className="block my-5 cursor-pointer">
        <p className="text-dark-text leading-relaxed">{content}</p>
      </Link>
      <div className="flex items-center gap-6 text-light-text border-t border-gray-200 pt-3">
        {/* ... (Post actions remain the same) ... */}
      </div>
    </div>
  );
}

export default Post;
// src/components/Post.jsx
import React from 'react';
import { ThumbsUp, MessageSquare, Share2 } from 'react-feather';

function Post({ authorName, authorAvatar, meta, content }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
      <div className="flex items-center gap-4">
        <img src={authorAvatar} alt={authorName} className="w-12 h-12 rounded-full" />
        <div>
          <span className="font-semibold text-dark-text">{authorName}</span>
          <p className="text-xs text-light-text" dangerouslySetInnerHTML={{ __html: meta }} />
        </div>
      </div>
      <div className="my-5">
        <p className="text-dark-text leading-relaxed">{content}</p>
      </div>
      <div className="flex items-center gap-6 text-light-text border-t border-gray-200 pt-3">
        <div className="flex items-center gap-2 cursor-pointer hover:text-primary-blue transition-colors">
          <ThumbsUp size={20} /><span>Like</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-primary-blue transition-colors">
          <MessageSquare size={20} /><span>Comment</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-primary-blue transition-colors">
          <Share2 size={20} /><span>Share</span>
        </div>
      </div>
    </div>
  );
}

export default Post;
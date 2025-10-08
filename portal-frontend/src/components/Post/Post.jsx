// src/components/Post.jsx
import React from "react";
import { ThumbsUp, MessageSquare, Share2 } from "react-feather";
import { Link } from "react-router-dom"; // <-- 1. Import Link
import { formatDistanceToNow, isValid } from "date-fns";

// Add `id` as a prop
function Post({ id, authorName, authorAvatar, created_at, meta, content }) {
  // To get the "ago" suffix, add the { addSuffix: true } option
  const parsedDate = new Date(created_at);
  const validDate = isValid(parsedDate)
    ? parsedDate
    : new Date("2025-10-08T15:28:37.020322Z");

  const timeAgo = formatDistanceToNow(validDate, { addSuffix: true });
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* ... (Post header and content remain the same) ... */}
      <div className="flex items-center gap-4">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <span className="font-semibold text-dark-text">{authorName}</span>
          <p
            className="text-xs text-light-text"
            dangerouslySetInnerHTML={{ __html: timeAgo }}
          />
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

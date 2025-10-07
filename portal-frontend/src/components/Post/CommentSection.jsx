// src/features/posts/components/CommentSection.jsx
import React from "react";
import Comment from "./Comment";

function CommentSection({ comments }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
      <h3 className="text-xl font-bold text-dark-text mb-6">
        {comments.length} Comments
      </h3>

      {/* Add a Comment Form */}
      <div className="flex items-start gap-4 mb-8">
        <img
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          alt="My Profile"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:outline-none transition"
            placeholder="Add your comment..."
            rows="2"
          ></textarea>
          <button className="bg-primary-blue text-white font-semibold py-2 px-5 rounded-full hover:bg-opacity-90 transition-all mt-2">
            Post Comment
          </button>
        </div>
      </div>

      {/* List of Comments */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            authorName={comment.authorName}
            authorAvatar={comment.authorAvatar}
            text={comment.text}
            time={comment.time}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentSection;

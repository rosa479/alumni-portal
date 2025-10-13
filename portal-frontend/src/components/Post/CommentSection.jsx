// src/features/posts/components/CommentSection.jsx
import React, { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import Comment from "./Comment";

function CommentSection({ comments }) {
  const [commentContent, setCommentContent] = useState("");

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      // TODO: Implement comment submission
      console.log("Comment:", commentContent);
      setCommentContent("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl mt-8">
      <h3 className="text-xl font-bold text-dark-text mb-6">
        {comments.length} Comments
      </h3>

      {/* Add a Comment Form */}
      <form onSubmit={handleSubmitComment}>
        <div className="flex items-start gap-4 mb-8">
          <img
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            alt="My Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={commentContent}
                  onChange={(val) => setCommentContent(val || '')}
                  placeholder="Share your thoughts..."
                  preview="edit"
                  hideToolbar={false}
                  visibleDragBar={false}
                  height={150}
                />
              </div>
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-all"
              disabled={!commentContent.trim()}
            >
              Post Comment
            </button>
          </div>
        </div>
      </form>

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

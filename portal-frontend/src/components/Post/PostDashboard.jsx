// src/components/PostDashboard.jsx
import React, { useState } from "react";
import { ThumbsUp, MessageSquare, Share2 } from "react-feather";
import { Link } from "react-router-dom";
import { formatDistanceToNow, isValid } from "date-fns";
import ReactMarkdown from 'react-markdown';
import apiClient from '../../interceptor';

// Add `id` as a prop
function PostDashboard({
  id,
  authorName,
  authorAvatar,
  created_at,
  community,
  content,
  title,
  imageUrl,
  tags = [],
  likesCount = 0,
  commentsCount = 0,
  isLiked = false,
  authorId
}) {
  // To get the "ago" suffix, add the { addSuffix: true } option
  const parsedDate = new Date(created_at);
  const validDate = isValid(parsedDate)
    ? parsedDate
    : new Date("2025-10-08T15:28:37.020322Z");

  const timeAgo = formatDistanceToNow(validDate, { addSuffix: true });
  
  // State for interactions
  const [currentLiked, setCurrentLiked] = useState(isLiked);
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [currentCommentsCount, setCurrentCommentsCount] = useState(commentsCount);
  const [isLoading, setIsLoading] = useState(false);

  // Handle like/unlike
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      if (currentLiked) {
        await apiClient.delete(`/posts/${id}/like/`);
        setCurrentLiked(false);
        setCurrentLikesCount(prev => prev - 1);
      } else {
        await apiClient.post(`/posts/${id}/like/`);
        setCurrentLiked(true);
        setCurrentLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle share
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: title || 'Check out this post',
      text: title || 'Check out this post from IIT Kharagpur Alumni Portal',
      url: `${window.location.origin}/posts/${id}`
    };

    // Check if Web Share API is supported (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback for desktop - copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        // Fallback: show the URL
        prompt('Copy this link:', shareData.url);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
      {/* Author Info - Make author name clickable */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span>{authorName.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="aspect-w-3 aspect-h-4 w-full ml-4 flex-1">
          <Link 
            to={`/users/${authorId}`}
            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
          >
            {authorName}
          </Link>
          <p className="text-sm text-gray-500">{community ? `${community} • ${timeAgo}` : timeAgo}</p>
        </div>
      </div>

      {/* 1. Title, content, and image - all clickable */}
      <Link to={`/posts/${id}`} className="block cursor-pointer">
        {title && <h3 className="text-md font-semibold text-dark-text mb-4 mt-4">{title}</h3>}
        
        {/* Post content */}
        <div className="text-dark-text mb-4">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        
        {/* Image */}
        {imageUrl && (
          <div className="mb-4 aspect-w-3 aspect-h-4 w-full rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt={title || 'Post image'}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </Link>

      {/* Engagement Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pt-4 border-t">
        <span>{currentLikesCount} like{currentLikesCount !== 1 ? 's' : ''}</span>
        <span>{currentCommentsCount} comment{currentCommentsCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-around pt-4 border-t">
        <button 
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            currentLiked
              ? "text-red-500 bg-red-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${currentLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">Like</span>
        </button>

        <Link
          to={`/posts/${id}`}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-medium">Comment</span>
        </Link>

        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span className="font-medium">Share</span>
        </button>
      </div>
    </div>
  );
}

export default PostDashboard;

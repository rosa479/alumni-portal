// src/components/Post.jsx
import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageSquare, Share2 } from "react-feather";
import { Link } from "react-router-dom"; // <-- 1. Import Link
import { formatDistanceToNow, isValid } from "date-fns";
import ReactMarkdown from 'react-markdown';
import apiClient from '../../interceptor';

// Add `id` as a prop
function Post({ id, authorName, authorAvatar, created_at, content, title, imageUrl, tags = [], likesCount = 0, commentsCount = 0, isLiked = false, authorId }) {
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
    <div className="bg-white p-6 rounded-xl ">
         {/* 3. User info and tags */}
         <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <Link to={authorId ? `/users/${authorId}` : '#'} className="font-semibold text-dark-text text-sm hover:underline">
              {authorName}
            </Link>
            <p className="text-xs text-light-text">
              {timeAgo}
            </p>
          </div>
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* 1. Title first */}
      <Link to={`/posts/${id}`} className="block cursor-pointer">
        {title && <h3 className="text-xl font-semibold text-dark-text mb-4">{title}</h3>}
        
        {/* 2. Image second */}
        {imageUrl && (
          <div className="mb-4">
            <img 
              src={imageUrl} 
              alt={title || 'Post image'} 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </Link>

   
      <div className="flex items-center gap-6 text-light-text border-t border-gray-200 pt-3">
        <button 
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-2 transition-colors ${
            currentLiked 
              ? 'text-blue-600 font-semibold' 
              : 'hover:text-blue-600'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ThumbsUp className={`w-4 h-4 ${currentLiked ? 'fill-current' : ''}`} />
          <span>{currentLikesCount > 0 ? currentLikesCount : ''} Like{currentLikesCount !== 1 ? 's' : ''}</span>
        </button>
        <Link 
          to={`/posts/${id}`}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{currentCommentsCount > 0 ? currentCommentsCount : ''} Comment{currentCommentsCount !== 1 ? 's' : ''}</span>
        </Link>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}

export default Post;

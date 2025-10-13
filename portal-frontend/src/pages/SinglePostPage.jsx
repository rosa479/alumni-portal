// src/features/posts/SinglePostPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Post from '../components/Post/Post';
import CommentSection from '../components/Post/CommentSection';
import apiClient from '../interceptor';

function SinglePostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

  // Fetch post details (same as before)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get('/posts/');
        // Compare IDs as strings for reliability
        const foundPost = response.data.find(p => String(p.id) === String(postId));
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Fetch comments for this post
  const fetchComments = async () => {
    setCommentLoading(true);
    try {
      const res = await apiClient.get(`/posts/${postId}/comments/`);
      // Map backend fields to frontend CommentSection format
      setComments(
        res.data.map(c => ({
          id: c.id,
          authorName: c.user_name || c.user || 'Unknown',
          authorAvatar: c.user_profile_picture || 'https://i.pravatar.cc/150?u=' + c.user,
          text: c.content,
          time: new Date(c.created_at).toLocaleString(),
          authorId: c.user_id || c.user || null,
        }))
      );
    } catch (err) {
      // Optionally handle error
    } finally {
      setCommentLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  // Handler to submit a new comment
  const handleAddComment = async (content) => {
    try {
      await apiClient.post(`/posts/${postId}/comments/`, { content });
      fetchComments(); // Refresh comments
      return true;
    } catch (err) {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Post not found</h1>
        <p className="text-gray-600">The post you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50 min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <main className="lg:col-span-2 space-y-6">
            <Post 
              id={post.id}
              authorName={post.author_name} 
              authorAvatar={post.author_profile_picture} 
              created_at={post.created_at}
              content={post.content}
              title={post.title}
              imageUrl={post.image_url}
              tags={post.tags}
              authorId={post.author_id || post.author}
            />
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              loading={commentLoading}
            />
          </main>

          {/* Right sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Post Details
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Community</span>
                  <span className="font-bold text-blue-800">
                    {post.community_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Author</span>
                  <span className="font-bold text-blue-800">
                    {post.author_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-bold text-blue-800">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags section */}
            {post.tags && post.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-4">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related posts or community info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                Community Rules
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be respectful and constructive</li>
                <li>• Stay on topic</li>
                <li>• No spam or self-promotion</li>
                <li>• Help others when you can</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default SinglePostPage;
// src/features/posts/SinglePostPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Post from '../components/Post/Post'; // Use the refactored Post component
import CommentSection from '../components/Post/CommentSection';

// Mock database for posts and their comments
const postsDB = {
  101: {
    id: 101, authorName: 'Rohan Shah', authorAvatar: 'https://i.pravatar.cc/150?u=rohan', meta: 'posted in Entrepreneurship Hub • 2h ago', content: 'Just closed our Series A funding! Huge thanks to the KGP network for the early support.',
    comments: [
      { id: 1, authorName: 'Ankit Sharma', authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', text: 'This is amazing news, Rohan! Congratulations!', time: '1h ago' },
      { id: 2, authorName: 'Priya Mehta', authorAvatar: 'https://i.pravatar.cc/150?u=priya', text: 'Well deserved. Your hard work paid off.', time: '45m ago' }
    ]
  },
  201: {
    id: 201, authorName: 'Dr. Vikram Singh', authorAvatar: 'https://i.pravatar.cc/150?u=vikram', meta: 'posted in AI & Machine Learning • 8h ago', content: 'Just published a new paper on transformer models in NLP. Happy to share the pre-print with anyone interested.',
    comments: [
       { id: 1, authorName: 'Jane Doe', authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', text: 'Fantastic work, Dr. Singh! Looking forward to reading it.', time: '6h ago' }
    ]
  }
};

function SinglePostPage() {
  const { postId } = useParams();
  const post = postsDB[postId];

  if (!post) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Post not found.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8 max-w-4xl">
      <Post 
        authorName={post.authorName} 
        authorAvatar={post.authorAvatar} 
        meta={post.meta} 
        content={post.content} 
      />
      <CommentSection comments={post.comments} />
    </div>
  );
}

export default SinglePostPage;
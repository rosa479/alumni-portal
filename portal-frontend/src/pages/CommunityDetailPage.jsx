// src/features/communities/CommunityDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import CommunityHeader from '../components/CommunityHeader';
import CreatePost from '../components/CreatePost'; // We can reuse this
import Post from '../components/Post/Post';         // and this!

// Let's create a more detailed mock database
const communitiesDB = {
  1: {
    id: 1, name: 'Entrepreneurship Hub', description: 'Connect with founders, investors, and mentors in the KGP network.', members: 1250,
    posts: [
      { id: 101, authorName: 'Rohan Shah', authorAvatar: 'https://i.pravatar.cc/150?u=rohan', meta: '2h ago', content: 'Just closed our Series A funding! Huge thanks to the KGP network for the early support.' },
      { id: 102, authorName: 'Priya Mehta', authorAvatar: 'https://i.pravatar.cc/150?u=priya', meta: '1d ago', content: 'Looking for a co-founder with a strong tech background for a new EdTech startup. DM me!' }
    ]
  },
  2: {
    id: 2, name: 'AI & Machine Learning', description: 'Discussions on the latest trends, research, and career opportunities in AI/ML.', members: 2800,
    posts: [
      { id: 201, authorName: 'Dr. Vikram Singh', authorAvatar: 'https://i.pravatar.cc/150?u=vikram', meta: '8h ago', content: 'Just published a new paper on transformer models in NLP. Happy to share the pre-print with anyone interested.' }
    ]
  },
  // Add other communities here...
};

function CommunityDetailPage() {
  const { communityId } = useParams(); // Get the ID from the URL, e.g., "1"
  const community = communitiesDB[communityId];

  // Handle case where community doesn't exist
  if (!community) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Community not found.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <CommunityHeader community={community} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <main className="lg:col-span-2">
          {/* Note: In a real app, you'd want a more specific CreatePost component */}
          <CreatePost /> 
          <div className="mt-6 space-y-6">
            {community.posts.map(post => (
              <Post 
                key={post.id} 
                 id={post.id}
                authorName={post.authorName} 
                authorAvatar={post.authorAvatar} 
                meta={post.meta} 
                content={post.content} 
              />
            ))}
          </div>
        </main>
        
        {/* You can add a community-specific right sidebar here later */}
        <aside className="hidden lg:block">
           <div className="bg-white p-6 rounded-xl shadow-lg">
             <h4 className="font-bold text-dark-text mb-4">About Community</h4>
             <p className="text-sm text-light-text">This is a space for members to share insights, ask questions, and collaborate.</p>
           </div>
        </aside>
      </div>
    </div>
  );
}

export default CommunityDetailPage;
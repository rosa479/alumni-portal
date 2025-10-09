// src/components/CreatePost.jsx
import React, { useState } from "react";
import apiClient from "../interceptor";

function CreatePost({ avatar, communities }) {
  const [content, setContent] = useState("");
  // 2. Add state to track the selected community.
  //    Initialize it with the ID of the first community.
  const [selectedCommunity, setSelectedCommunity] = useState(
    communities[0]?.id
  );

  /**
   * Creates a new post on the server.
   * @param {string} communityId - The UUID of the community to post in.
   * @param {string} postContent - The text content of the post.
   * @returns {Promise<object>} The newly created post object from the server.
   */
  const createNewPost = async (communityId, postContent) => {
    try {
      // 1. Define the data payload. It only needs the writable fields.
      const postData = {
        community: communityId,
        content: postContent,
      };

      console.log("Sending post data:", postData);

      // 2. Send the POST request to your /api/posts/ endpoint.
      const response = await apiClient.post("/api/posts/", postData);

      // 3. The server will respond with the full, newly created post object.
      console.log("Post created successfully:", response.data);
      return response.data;
    } catch (error) {
      // 4. Handle potential errors (e.g., validation errors, server offline).
      console.error(
        "Failed to create post:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 flex items-start gap-4">
      <img src={avatar} alt="My Profile" className="w-12 h-12 rounded-full" />
      <form
        className="w-full"
        onSubmit={async (e) => createNewPost(selectedCommunity, content)}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none transition"
          placeholder="Share something with your alumni network..."
          rows="3"
        ></textarea>
        {/* 3. This container now separates the dropdown and the button */}
        <div className="flex justify-between items-center mt-3">
          {/* 4. The community dropdown menu */}
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            {/* 5. Options are created dynamically from the mock data */}
            {communities.map((community) => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>

          <button
            className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-full hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!content.trim() || !selectedCommunity}
            type="submit"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;

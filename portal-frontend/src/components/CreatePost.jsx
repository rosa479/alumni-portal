// src/components/CreatePost.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import MDEditor from '@uiw/react-md-editor';
import Cropper from 'react-easy-crop';
import confetti from "canvas-confetti";
import apiClient from "../interceptor";

// Helper to get cropped image as blob
function getCroppedImg(imageSrc, crop, aspect, rotation = 0) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg');
    };
    image.onerror = reject;
  });
}

function CreatePost({ avatar, communities = [], onClose }) {
  if (!communities || communities.length === 0) {
    // You can return a loading spinner or just nothing
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        Loading communities...
      </div>
    );
  }

  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(
    communities[0]?.id || ""
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(1); // 1 for 1:1, 3/4 for 3:4

  // Fetch tags when community changes
  useEffect(() => {
    const fetchTags = async () => {
      if (selectedCommunity) {
        try {
          const response = await apiClient.get(`/communities/${selectedCommunity}/user-tags/`);
          setAvailableTags(response.data);
        } catch (error) {
          console.error('Failed to fetch tags:', error);
          setAvailableTags([]);
        }
      }
    };
    fetchTags();
  }, [selectedCommunity]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCropImageSrc(ev.target.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // When cropping is done
  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels, aspect);
      setImageFile(new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" }));
      setImagePreview(URL.createObjectURL(croppedBlob));
      setCropModalOpen(false);
      setCropImageSrc(null);
    } catch (err) {
      alert("Failed to crop image.");
    }
  };

  // Upload image to S3
  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiClient.post('/upload-image/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data.image_url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Creates a new post on the server.
   * @param {string} communityId - The UUID of the community to post in.
   * @param {string} postContent - The text content of the post.
   * @returns {Promise<object>} The newly created post object from the server.
   */
  const createNewPost = async () => {
    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const postData = {
        community: selectedCommunity,
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl,
        tags: selectedTags,
      };
      await apiClient.post("/posts/", postData);

      // Show success state
      setShowSuccess(true);
      setContent("");
      setTitle("");
      setImageFile(null);
      setImagePreview(null);
      setSelectedTags([]);

      // Confetti animation
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Optionally, after a delay, close or reset
      // setTimeout(() => {
      //   setShowSuccess(false);
      //   if (onClose) onClose();
      // }, 3000);

    } catch (error) {
      console.error(
        "Failed to create post:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  // Success animation SVG
  const SuccessCheck = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="w-20 h-20 text-green-500 mb-4" viewBox="0 0 52 52">
        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" stroke="#22c55e" strokeWidth="3"/>
        <path className="checkmark__check" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 16-16">
          <animate attributeName="stroke-dasharray" from="0,40" to="40,0" dur="0.5s" fill="freeze" />
        </path>
      </svg>
      <h2 className="text-2xl font-bold text-green-600 mb-2">Post Published!</h2>
      <p className="text-gray-600 mb-6">Your post has been shared with the community.</p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        onClick={() => {
          setShowSuccess(false);
          if (onClose) onClose();
        }}
      >
        Create Another Post
      </button>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100 min-h-[400px] flex flex-col justify-center">
      {showSuccess ? (
        <SuccessCheck />
      ) : (
        <>
          {/* Crop Modal */}
          {cropModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
              <div className="bg-white rounded-xl p-6 shadow-lg max-w-lg w-full relative">
                <h3 className="font-semibold mb-4">Crop Image</h3>
                <div className="relative w-full h-72 bg-gray-200">
                  <Cropper
                    image={cropImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <button
                      className={`px-3 py-1 rounded mr-2 ${aspect === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                      onClick={() => setAspect(1)}
                    >
                      1:1
                    </button>
                    <button
                      className={`px-3 py-1 rounded ${aspect === 3 / 4 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                      onClick={() => setAspect(3 / 4)}
                    >
                      3:4
                    </button>
                  </div>
                  <div>
                    <button
                      className="px-4 py-2 bg-gray-200 rounded mr-2"
                      onClick={() => {
                        setCropModalOpen(false);
                        setCropImageSrc(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                      onClick={handleCropSave}
                    >
                      Crop & Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-6">
            <div className="relative">
              <img
                src={avatar}
                alt="My Profile"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Create Post</h3>
              <p className="text-sm text-gray-500">Share something with your alumni network</p>
            </div>
          </div>
          <form
            className="w-full"
            onSubmit={async (e) => {
              e.preventDefault();
              await createNewPost();
              // Optionally, you can call onClose() here after successful post
              // if (onClose) onClose();
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none transition"
                placeholder="What's your post about?"
              />
            </div>
            {/* Markdown Editor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
          placeholder="Share something with your alumni network..."
                  preview="edit"
                  hideToolbar={false}
                  visibleDragBar={false}
                  height={200}
                />
              </div>
            </div>
            {/* Image Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Image <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm text-gray-600">Click to upload an image</span>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Image selected</p>
                        <p className="text-xs text-gray-500">Ready to upload</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tag Selection */}
            {availableTags.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select relevant tags <span className="text-gray-500 text-xs">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((userTag) => {
                    const isSelected = selectedTags.includes(userTag.tag_name);
                    return (
                      <button
                        key={userTag.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(selectedTags.filter(tag => tag !== userTag.tag_name));
                          } else {
                            setSelectedTags([...selectedTags, userTag.tag_name]);
                          }
                        }}
                        className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                        }`}
                      >
                        <span className="mr-1">
                          {isSelected ? '✓' : '+'}
                        </span>
                        {userTag.tag_name}
                      </button>
                    );
                  })}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Selected tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Community Selection and Submit */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post to Community
                  </label>
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="w-full sm:w-auto bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 min-w-[200px]"
                  >
                    {communities.map((community) => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition-all"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg"
                    disabled={!content.trim() || !selectedCommunity || isUploading}
                    type="submit"
                  >
                    {isUploading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Post</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default CreatePost;

import React, { useState } from 'react';
import { Camera, Upload } from 'react-feather';
import apiClient from '../../interceptor';

function ProfilePhotoUpload({ currentPhotoUrl, onPhotoUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const uploadResponse = await apiClient.post('/upload-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const imageUrl = uploadResponse.data.image_url;

      // Update profile with new image URL
      await apiClient.put('/profiles/me/update/', {
        profile_picture_url: imageUrl
      });

      onPhotoUpdate(imageUrl);
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error('Failed to upload photo:', error);
      setPreviewUrl(currentPhotoUrl); // Reset on error
      alert('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
        <img
          src={previewUrl || 'https://i.pravatar.cc/150?u=default'}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      
      <label className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
        {uploading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Camera className="w-5 h-5" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
}

export default ProfilePhotoUpload;
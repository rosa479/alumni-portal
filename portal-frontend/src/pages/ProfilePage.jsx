// src/features/profile/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import ProfileHeader from "../components/Profile/ProfileHeader";
import VerificationAlert from "../components/Profile/VerificationAlert";
import WorkExperienceManager from "../components/Profile/WorkExperienceManager";
import EducationManager from "../components/Profile/EducationManager";
import SkillsManager from "../components/Profile/SkillsManager";
import ProfilePhotoUpload from "../components/Profile/ProfilePhotoUpload";
import EditableSection from "../components/Profile/EditableSection";
import apiClient from "../interceptor";
import NetworkStatsSection from "../components/Profile/NetworkStat";
import { Edit3, Save, X } from 'react-feather';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [basicFormData, setBasicFormData] = useState({
    full_name: '',
    graduation_year: '',
    department: '',
    about_me: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get("/profiles/me/");
      setUser(response.data);
      
      // Set form data
      if (response.data.alumni_profile) {
        setBasicFormData({
          full_name: response.data.alumni_profile.full_name || '',
          graduation_year: response.data.alumni_profile.graduation_year || '',
          department: response.data.alumni_profile.department || '',
          about_me: response.data.alumni_profile.about_me || ''
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Could not load profile information.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpdate = (newPhotoUrl) => {
    setUser(prev => ({
      ...prev,
      alumni_profile: {
        ...prev.alumni_profile,
        profile_picture_url: newPhotoUrl
      }
    }));
  };

  const handleBasicInfoSave = async () => {
    try {
      await apiClient.put('/profiles/me/update/', basicFormData);
      await fetchUserProfile(); // Refresh data
      setIsEditingBasic(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl text-center">
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isVerified = user.status === 'VERIFIED';

  return (
    <div className="bg-[#F5F8FA] min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Profile Header with Photo Upload */}
        <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3] mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <ProfilePhotoUpload
                currentPhotoUrl={user.alumni_profile?.profile_picture_url}
                onPhotoUpdate={handlePhotoUpdate}
              />
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-center lg:text-left">
              {!isEditingBasic ? (
                <div>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-[#0077B5] mb-2">
                        {user.alumni_profile?.full_name || 'Your Name'}
                      </h1>
                      <p className="text-lg text-gray-600 mb-2">
                        {user.role} • Class of {user.alumni_profile?.graduation_year}
                      </p>
                      <p className="text-gray-600">{user.alumni_profile?.department}</p>
                    </div>
                    <button
                      onClick={() => setIsEditingBasic(true)}
                      className="mt-4 lg:mt-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {user.alumni_profile?.about_me && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p>{user.alumni_profile.about_me}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={basicFormData.full_name}
                        onChange={(e) => setBasicFormData({...basicFormData, full_name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="number"
                        value={basicFormData.graduation_year}
                        onChange={(e) => setBasicFormData({...basicFormData, graduation_year: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={basicFormData.department}
                        onChange={(e) => setBasicFormData({...basicFormData, department: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      About Me
                    </label>
                    <textarea
                      value={basicFormData.about_me}
                      onChange={(e) => setBasicFormData({...basicFormData, about_me: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleBasicInfoSave}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingBasic(false)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Alert */}
        {!isVerified && <VerificationAlert status={user.status} />}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Work Experience */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Work Experience</h2>
              <WorkExperienceManager />
            </div>
            
            {/* Education */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Education</h2>
              <EducationManager />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Network Stats */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Network Stats</h2>
              <NetworkStatsSection user={user} />
            </div>
            
            {/* Skills */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Skills</h2>
              <SkillsManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

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
import {
  Edit3,
  Save,
  X,
  Linkedin,
  GitHub,
  Twitter,
  Globe,
  Mail,
  Instagram,
} from "react-feather";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [basicFormData, setBasicFormData] = useState({
    full_name: "",
    graduation_year: "",
    department: "",
    about_me: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "https://www.linkedin.com/in/shubham-krishan",
    github: "https://www.github.com/shub-krishan208",
    twitter: "",
    instagram: "",
    website: "",
    email: "shubhamkrishan999@gmail.com",
  });

  // Load social links from localStorage
  useEffect(() => {
    const savedLinks = localStorage.getItem("social-links");
    if (savedLinks) {
      setSocialLinks(JSON.parse(savedLinks));
    }
  }, []);

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
          full_name: response.data.alumni_profile.full_name || "",
          graduation_year: response.data.alumni_profile.graduation_year || "",
          department: response.data.alumni_profile.department || "",
          about_me: response.data.alumni_profile.about_me || "",
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
    setUser((prev) => ({
      ...prev,
      alumni_profile: {
        ...prev.alumni_profile,
        profile_picture_url: newPhotoUrl,
      },
    }));
  };

  const handleBasicInfoSave = async () => {
    try {
      await apiClient.put("/profiles/me/update/", basicFormData);
      // Save social links to localStorage
      localStorage.setItem("social-links", JSON.stringify(socialLinks));
      await fetchUserProfile(); // Refresh data
      setIsEditingBasic(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
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

  const isVerified = user.status === "VERIFIED";

  // Social link icon mapping
  const getSocialIcon = (platform) => {
    const icons = {
      linkedin: Linkedin,
      github: GitHub,
      twitter: Twitter,
      instagram: Instagram,
      website: Globe,
      email: Mail,
    };
    return icons[platform] || Globe;
  };

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
                        {user.alumni_profile?.full_name || "Your Name"}
                      </h1>
                      <p className="text-lg text-gray-600 mb-2">
                        {user.role} • Class of{" "}
                        {user.alumni_profile?.graduation_year}
                      </p>
                      <p className="text-gray-600">
                        {user.alumni_profile?.department}
                      </p>
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

                  {/* Social Links Display */}
                  {Object.values(socialLinks).some((link) => link) && (
                    <div className="mt-4 flex flex-wrap gap-3 justify-center lg:justify-start">
                      {socialLinks.linkedin && (
                        <a
                          href={socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.github && (
                        <a
                          href={socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                        >
                          <GitHub className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a
                          href={socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a
                          href={socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-colors"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.website && (
                        <a
                          href={socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                      {socialLinks.email && (
                        <a
                          href={`mailto:${socialLinks.email}`}
                          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
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
                        onChange={(e) =>
                          setBasicFormData({
                            ...basicFormData,
                            full_name: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setBasicFormData({
                            ...basicFormData,
                            graduation_year: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setBasicFormData({
                            ...basicFormData,
                            department: e.target.value,
                          })
                        }
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
                      onChange={(e) =>
                        setBasicFormData({
                          ...basicFormData,
                          about_me: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows="3"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Social Links Edit Section */}
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Social Links
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-[#0077B5]" />
                            LinkedIn
                          </div>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.linkedin}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              linkedin: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <GitHub className="w-4 h-4 text-gray-800" />
                            GitHub
                          </div>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.github}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              github: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="https://github.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                            Twitter
                          </div>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.twitter}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              twitter: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="https://twitter.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Instagram className="w-4 h-4 text-pink-500" />
                            Instagram
                          </div>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.instagram}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              instagram: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="https://instagram.com/username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-600" />
                            Website
                          </div>
                        </label>
                        <input
                          type="url"
                          value={socialLinks.website}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              website: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-red-600" />
                            Email
                          </div>
                        </label>
                        <input
                          type="email"
                          value={socialLinks.email}
                          onChange={(e) =>
                            setSocialLinks({
                              ...socialLinks,
                              email: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
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
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">
                Work Experience
              </h2>
              <WorkExperienceManager />
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">
                Education
              </h2>
              <EducationManager />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Network Stats */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">
                Network Stats
              </h2>
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

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileHeader from "../components/Profile/ProfileHeader";
import VerificationAlert from "../components/Profile/VerificationAlert";
import apiClient from "../interceptor";
import NetworkStatsSection from "../components/Profile/NetworkStat";
import { Briefcase, Calendar, MapPin, BookOpen, Award, Star } from 'react-feather';

function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get(`/profiles/${userId}/`);
        setUser(response.data);
        // TODO: Fetch connection status
        // setIsConnected(response.data.is_connected);
      } catch (err) {
        setError("Could not load profile information.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const handleConnect = async () => {
    setConnectLoading(true);
    try {
      // TODO: Implement connect API
      // await apiClient.post(`/connections/${userId}/connect/`);
      setIsConnected(true);
    } catch (err) {
      // Optionally show error
    } finally {
      setConnectLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const renderStars = (level) => {
    const skillLevels = {
      'BEGINNER': 1,
      'INTERMEDIATE': 2,
      'ADVANCED': 3,
      'EXPERT': 4
    };
    
    const stars = skillLevels[level] || 2;
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="bg-white p-6 rounded-xl shadow-lg text-center"><p>Loading Profile...</p></div>;
  }
  if (error) {
    return <div className="bg-white p-6 rounded-xl shadow-lg text-center text-red-500"><p>{error}</p></div>;
  }
  if (!user) return null;

  const isVerified = user.status === 'VERIFIED';

  return (
    <div className="bg-[#F5F8FA] min-h-screen">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3] mb-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mx-auto">
                <img
                  src={user.alumni_profile?.profile_picture_url || 'https://i.pravatar.cc/150?u=' + user.id}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-[#0077B5]">
                      {user.alumni_profile?.full_name || 'User Name'}
                    </h1>
                    {isVerified && (
                      <span title="Verified" className="text-blue-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-gray-600 mb-2">
                    {user.role} • Class of {user.alumni_profile?.graduation_year}
                  </p>
                  <p className="text-gray-600">{user.alumni_profile?.department}</p>
                </div>
                
                {/* Connect Button */}
                <div className="mt-4 lg:mt-0">
                  <button
                    className={`px-6 py-2 rounded-lg font-semibold border transition-all text-blue-600 border-blue-600 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed`}
                    onClick={handleConnect}
                    disabled={isConnected || connectLoading}
                  >
                    {isConnected ? 'Connected' : connectLoading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
              
              {user.alumni_profile?.about_me && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-700">{user.alumni_profile.about_me}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Alert for unverified users */}
        {!isVerified && <VerificationAlert status={user.status} />}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Work Experience */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Work Experience</h2>
              {user.alumni_profile?.work_experiences && user.alumni_profile.work_experiences.length > 0 ? (
                <div className="space-y-6">
                  {user.alumni_profile.work_experiences.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold text-dark-text">{exp.position}</h4>
                      </div>
                      <p className="text-blue-600 font-medium mb-1">{exp.company_name}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
                        </div>
                        {exp.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{exp.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {exp.description && (
                        <p className="text-gray-700 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No work experience added yet.</p>
              )}
            </div>
            
            {/* Education */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Education</h2>
              {user.alumni_profile?.education_history && user.alumni_profile.education_history.length > 0 ? (
                <div className="space-y-6">
                  {user.alumni_profile.education_history.map((edu) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <h4 className="text-lg font-semibold text-dark-text">{edu.degree}</h4>
                      </div>
                      <p className="text-blue-600 font-medium mb-1">{edu.institution_name}</p>
                      
                      {edu.field_of_study && (
                        <p className="text-gray-600 mb-1">{edu.field_of_study}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(edu.start_date)} - {formatDate(edu.end_date)}</span>
                        </div>
                        {edu.grade && (
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span>{edu.grade}</span>
                          </div>
                        )}
                      </div>
                      
                      {edu.description && (
                        <p className="text-gray-700 text-sm">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No education history added yet.</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Network Stats */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Profile Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Legacy Score</span>
                  <span className="font-bold text-lg text-blue-600">
                    {user.alumni_profile?.credit_score || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Communities</span>
                  <span className="font-bold text-lg">
                    {user.joined_communities_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-bold text-lg">
                    {user.posts_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    isVerified 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div className="bg-white rounded-2xl p-8 border border-[#E3EAF3]">
              <h2 className="text-2xl font-bold text-[#0077B5] mb-6">Skills</h2>
              {user.alumni_profile?.skills && user.alumni_profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {user.alumni_profile.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-blue-800">{skill.name}</span>
                        {renderStars(skill.level)}
                      </div>
                      <span className="text-xs text-blue-600">
                        {skill.level.charAt(0) + skill.level.slice(1).toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No skills added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;

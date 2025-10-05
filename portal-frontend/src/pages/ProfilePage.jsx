// src/features/profile/ProfilePage.jsx
import React from 'react';
import ProfileHeader from '../components/Profile/ProfileHeader';
import VerificationAlert from '../components/Profile/VerificationAlert';
import ExperienceSection from '../components/Profile/ExperienceSection';
import EducationSection from '../components/Profile/EducationSection'; // <-- 1. Import Education
import SkillsSection from '../components/Profile/SkillsSection';       // <-- 2. Import Skills

// We'll assume the user is pending verification for this example
const isVerified = false;

function ProfilePage() {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <ProfileHeader />
      
      {/* Conditionally render the alert */}
      {!isVerified && <VerificationAlert />}
      
      {/* --- 3. New Two-Column Layout --- */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-2 space-y-8">
          <ExperienceSection />
          <EducationSection />
        </div>
        
        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-1 space-y-8">
          <SkillsSection />
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
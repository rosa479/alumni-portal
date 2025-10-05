
import React from 'react';
import { Edit } from 'react-feather';

// In a real app, user data would be passed as props
const user = {
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  title: 'Senior Software Engineer at Google',
  location: 'Bangalore, Karnataka',
  gradInfo: 'Class of 2018, Computer Science'
};

function ProfileHeader() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full border-4 border-primary-blue" />
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-3xl font-bold text-dark-text">{user.name}</h1>
          <p className="text-lg text-light-text mt-1">{user.title}</p>
          <p className="text-md text-light-text mt-2">{user.gradInfo}</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-blue text-white font-semibold py-2 px-5 rounded-full hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5">
          <Edit size={16} />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
}

export default ProfileHeader;
import React from 'react';
import { Star } from 'react-feather';

function ReadOnlySkills({ skills }) {
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

  if (!skills || skills.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No skills added yet.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill) => (
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
  );
}

export default ReadOnlySkills;
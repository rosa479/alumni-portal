// src/features/profile/components/SkillsSection.jsx
import React from 'react';

// Mock data
const skills = [
  'React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Python',
  'Django', 'PostgreSQL', 'Docker', 'AWS', 'System Design'
];

function SkillsSection() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-dark-text mb-4">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <span key={skill} className="bg-blue-100 text-primary-blue text-sm font-semibold px-3 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SkillsSection;
// src/features/profile/components/EducationSection.jsx
import React from 'react';
import { BookOpen } from 'react-feather';

// Mock data
const education = [
  { id: 1, degree: 'Bachelor of Technology, Computer Science', school: 'Indian Institute of Technology, Kharagpur', period: '2014 - 2018' },
];

function EducationSection() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-dark-text mb-4">Education</h3>
      <ul className="space-y-4">
        {education.map(edu => (
          <li key={edu.id} className="flex items-start gap-4">
            <div className="bg-light-bg p-3 rounded-full">
              <BookOpen className="text-primary-blue" />
            </div>
            <div>
              <h4 className="font-semibold">{edu.school}</h4>
              <p className="text-light-text">{edu.degree}</p>
              <p className="text-sm text-light-text">{edu.period}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EducationSection;
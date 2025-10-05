// src/features/profile/components/ExperienceSection.jsx
import React from 'react';
import { Briefcase } from 'react-feather';

// Mock data
const experiences = [
  { id: 1, title: 'Senior Software Engineer', company: 'Google', period: '2022 - Present' },
  { id: 2, title: 'Software Engineer', company: 'Microsoft', period: '2020 - 2022' },
  { id: 3, title: 'SDE Intern', company: 'Amazon', period: '2019' },
];

function ExperienceSection() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-dark-text mb-4">Work Experience</h3>
      <ul className="space-y-4">
        {experiences.map(exp => (
          <li key={exp.id} className="flex items-start gap-4">
            <div className="bg-light-bg p-3 rounded-full">
              <Briefcase className="text-primary-blue" />
            </div>
            <div>
              <h4 className="font-semibold">{exp.title}</h4>
              <p className="text-light-text">{exp.company}</p>
              <p className="text-sm text-light-text">{exp.period}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExperienceSection;
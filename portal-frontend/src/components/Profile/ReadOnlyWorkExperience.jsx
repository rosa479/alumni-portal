import React from 'react';
import { Briefcase, Calendar, MapPin } from 'react-feather';

function ReadOnlyWorkExperience({ experiences }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (!experiences || experiences.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No work experience added yet.</p>
    );
  }

  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
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
  );
}

export default ReadOnlyWorkExperience;
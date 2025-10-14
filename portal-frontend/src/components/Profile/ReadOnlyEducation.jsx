import React from 'react';
import { BookOpen, Calendar, Award } from 'react-feather';

function ReadOnlyEducation({ education }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (!education || education.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No education history added yet.</p>
    );
  }

  return (
    <div className="space-y-6">
      {education.map((edu) => (
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
  );
}

export default ReadOnlyEducation;
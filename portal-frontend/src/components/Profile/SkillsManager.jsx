import React, { useState, useEffect } from 'react';
import { Plus, X, Star } from 'react-feather';
import apiClient from '../../interceptor';

function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'INTERMEDIATE' });

  const skillLevels = [
    { value: 'BEGINNER', label: 'Beginner', stars: 1 },
    { value: 'INTERMEDIATE', label: 'Intermediate', stars: 2 },
    { value: 'ADVANCED', label: 'Advanced', stars: 3 },
    { value: 'EXPERT', label: 'Expert', stars: 4 }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await apiClient.get('/skills/');
      setSkills(response.data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    
    try {
      await apiClient.post('/skills/', newSkill);
      await fetchSkills();
      setNewSkill({ name: '', level: 'INTERMEDIATE' });
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add skill:', error);
      alert('Failed to add skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await apiClient.delete(`/skills/${id}/`);
      await fetchSkills();
    } catch (error) {
      console.error('Failed to delete skill:', error);
      alert('Failed to delete skill. Please try again.');
    }
  };

  const renderStars = (level) => {
    const skillLevel = skillLevels.find(s => s.value === level);
    const stars = skillLevel ? skillLevel.stars : 2;
    
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

  return (
    <div className="space-y-4">
      {/* Existing Skills */}
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">{skill.name}</span>
                {renderStars(skill.level)}
              </div>
              <span className="text-xs text-blue-600">
                {skillLevels.find(s => s.value === skill.level)?.label}
              </span>
            </div>
            <button
              onClick={() => handleDeleteSkill(skill.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Skill */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="JavaScript, Python, etc."
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                value={newSkill.level}
                onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {skillLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
            
            <button
              onClick={() => {
                setIsAdding(false);
                setNewSkill({ name: '', level: 'INTERMEDIATE' });
              }}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillsManager;
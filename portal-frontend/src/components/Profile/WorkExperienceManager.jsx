import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Briefcase, Calendar, MapPin } from 'react-feather';
import apiClient from '../../interceptor';

function WorkExperienceManager() {
  const [experiences, setExperiences] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    is_current: false
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await apiClient.get('/work-experience/');
      setExperiences(response.data);
    } catch (error) {
      console.error('Failed to fetch work experiences:', error);
    }
  };

  const handleSave = async () => {
    try {
      // If is_current is true, set end_date to null
      const dataToSend = {
        ...formData,
        end_date: formData.is_current ? null : formData.end_date
      };

      if (editingId) {
        await apiClient.put(`/work-experience/${editingId}/`, dataToSend);
      } else {
        await apiClient.post('/work-experience/', dataToSend);
      }

      await fetchExperiences();
      resetForm();
    } catch (error) {
      console.error('Failed to save work experience:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this work experience?')) return;
    
    try {
      await apiClient.delete(`/work-experience/${id}/`);
      await fetchExperiences();
    } catch (error) {
      console.error('Failed to delete work experience:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const startEdit = (experience) => {
    setFormData({
      company_name: experience.company_name,
      position: experience.position,
      location: experience.location || '',
      start_date: experience.start_date,
      end_date: experience.end_date || '',
      description: experience.description || '',
      is_current: experience.is_current
    });
    setEditingId(experience.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing Experiences */}
      {experiences.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
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
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => startEdit(exp)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add New Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Work Experience
        </button>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Work Experience' : 'Add Work Experience'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Software Engineer"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Google"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Bangalore, India"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={formData.is_current}
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({
                    ...formData, 
                    is_current: e.target.checked,
                    end_date: e.target.checked ? '' : formData.end_date
                  })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">I currently work here</span>
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="3"
              placeholder="Describe your role and achievements..."
            />
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={resetForm}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkExperienceManager;
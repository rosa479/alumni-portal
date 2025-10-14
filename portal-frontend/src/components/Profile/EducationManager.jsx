import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, BookOpen, Calendar, Award } from 'react-feather';
import apiClient from '../../interceptor';

function EducationManager() {
  const [educations, setEducations] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    institution_name: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    grade: '',
    description: ''
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await apiClient.get('/education/');
      setEducations(response.data);
    } catch (error) {
      console.error('Failed to fetch education:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await apiClient.put(`/education/${editingId}/`, formData);
      } else {
        await apiClient.post('/education/', formData);
      }
      
      await fetchEducations();
      resetForm();
    } catch (error) {
      console.error('Failed to save education:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    
    try {
      await apiClient.delete(`/education/${id}/`);
      await fetchEducations();
    } catch (error) {
      console.error('Failed to delete education:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const startEdit = (education) => {
    setFormData({
      institution_name: education.institution_name,
      degree: education.degree,
      field_of_study: education.field_of_study || '',
      start_date: education.start_date,
      end_date: education.end_date || '',
      grade: education.grade || '',
      description: education.description || ''
    });
    setEditingId(education.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      institution_name: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      grade: '',
      description: ''
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
      {/* Existing Education */}
      {educations.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
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
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => startEdit(edu)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(edu.id)}
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
          Add Education
        </button>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Education' : 'Add Education'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution *
              </label>
              <input
                type="text"
                value={formData.institution_name}
                onChange={(e) => setFormData({...formData, institution_name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="IIT Kharagpur"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree *
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({...formData, degree: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Bachelor of Technology"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={(e) => setFormData({...formData, field_of_study: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Computer Science"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade/GPA
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({...formData, grade: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="8.5/10 or First Class"
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
              />
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
              placeholder="Additional details about your education..."
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

export default EducationManager;
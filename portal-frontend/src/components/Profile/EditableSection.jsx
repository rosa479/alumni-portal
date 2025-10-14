import React, { useState } from 'react';
import { Edit3, Save, X } from 'react-feather';

function EditableSection({ title, children, onSave, isEditing, setIsEditing }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-dark-text">{title}</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
        </button>
      </div>
      {children}
      {isEditing && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default EditableSection;
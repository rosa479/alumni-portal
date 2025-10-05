// src/features/profile/components/VerificationAlert.jsx
import React from 'react';
import { AlertTriangle } from 'react-feather';

function VerificationAlert() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-md my-8">
      <div className="flex items-center">
        <AlertTriangle className="text-yellow-500 mr-3" />
        <div>
          <h4 className="font-bold text-yellow-800">Account Verification Pending</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Your access is limited. Please upload your graduation certificate to unlock all features.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerificationAlert;
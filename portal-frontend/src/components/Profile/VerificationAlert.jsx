// src/features/profile/components/VerificationAlert.jsx
import React from "react";
// Import the icons we'll need
import { AlertTriangle, XCircle } from "react-feather";

// The component now accepts a 'status' prop
function VerificationAlert({ status }) {
  // 1. For a "VERIFIED" status, we don't need to show an alert.
  if (status === "VERIFIED") {
    return null;
  }

  // 2. Define configurations for each alert type to keep the JSX clean.
  const statusConfig = {
    PENDING: {
      Icon: AlertTriangle,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      iconColor: "text-yellow-500",
      titleColor: "text-yellow-800",
      textColor: "text-yellow-700",
      title: "Account Verification Pending",
      message:
        "Your access is limited. An administrator will review your profile soon.",
    },
    REJECTED: {
      Icon: XCircle,
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      iconColor: "text-red-500",
      titleColor: "text-red-800",
      textColor: "text-red-700",
      title: "Verification Rejected",
      message:
        "There was an issue with your submitted documents. Please re-upload or contact support.",
    },
  };

  // 3. Select the correct configuration based on the status prop.
  const config = statusConfig[status];

  // If the status is unknown or doesn't have a config, render nothing.
  if (!config) {
    return null;
  }

  // Use a variable for the Icon component
  const { Icon } = config;

  return (
    <div
      className={`${config.bgColor} border-l-4 ${config.borderColor} p-4 rounded-r-lg shadow-md my-8`}
    >
      <div className="flex items-center">
        <Icon className={`${config.iconColor} mr-3`} />
        <div>
          <h4 className={`font-bold ${config.titleColor}`}>{config.title}</h4>
          <p className={`text-sm ${config.textColor} mt-1`}>{config.message}</p>
        </div>
      </div>
    </div>
  );
}

export default VerificationAlert;

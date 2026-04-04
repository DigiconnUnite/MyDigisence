import React from "react";

interface AdminEmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: AdminEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className={`text-gray-500 ${action ? "mb-4" : ""}`}>{description}</p>
      {action}
    </div>
  );
}
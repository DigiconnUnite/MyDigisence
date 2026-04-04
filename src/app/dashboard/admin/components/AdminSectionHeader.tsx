import React from "react";

interface AdminSectionHeaderProps {
  title: string;
  description: string;
}

export default function AdminSectionHeader({
  title,
  description,
}: AdminSectionHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
}
"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Plus, FolderKanban, Briefcase, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick?: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
  isLoading?: boolean;
}

const defaultActions: QuickAction[] = [
  { id: "add-service", label: "Add Service", icon: Plus, color: "bg-blue-50 text-blue-600" },
  { id: "add-project", label: "Add Project", icon: FolderKanban, color: "bg-purple-50 text-purple-600" },
  { id: "add-portfolio", label: "Add Portfolio", icon: Briefcase, color: "bg-pink-50 text-pink-600" },
  { id: "share-profile", label: "Share Profile", icon: Share2, color: "bg-green-50 text-green-600" },
];

export default function QuickActions({
  actions,
  isLoading = false,
}: QuickActionsProps) {
  const data = actions || defaultActions;

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-4 gap-3">
        {data.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                  action.color || "bg-gray-100 text-gray-600"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-600 text-center group-hover:text-gray-900">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

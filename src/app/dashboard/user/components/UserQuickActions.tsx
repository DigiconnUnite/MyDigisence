"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Building, Users, Settings, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType | (() => React.ReactNode);
  onClick?: () => void;
  color?: string;
}

interface UserQuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  { id: "browse-businesses", label: "Browse Businesses", icon: Building, color: "bg-blue-50 text-blue-600" },
  { id: "find-professionals", label: "Find Professionals", icon: Users, color: "bg-purple-50 text-purple-600" },
  { id: "update-profile", label: "Update Profile", icon: Settings, color: "bg-pink-50 text-pink-600" },
  { id: "view-inquiries", label: "View Inquiries", icon: FileText, color: "bg-green-50 text-green-600" },
];

export default function UserQuickActions({
  actions,
}: UserQuickActionsProps) {
  const data = actions || defaultActions;

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

      <div className="grid grid-cols-4 gap-3">
        {data.map((action) => {
          const Icon = typeof action.icon === 'function' ? action.icon : action.icon;
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
                {typeof action.icon === 'function' ? <Icon /> : <Icon className="h-5 w-5" />}
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
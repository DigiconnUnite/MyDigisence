"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressItem {
  label: string;
  percentage: number;
  completed: boolean;
}

interface UserAccountProgressProps {
  items?: ProgressItem[];
  onImproveProfile?: () => void;
}

const defaultItems: ProgressItem[] = [
  { label: "Profile Information", percentage: 100, completed: true },
  { label: "Avatar", percentage: 80, completed: false },
  { label: "Bio", percentage: 60, completed: false },
  { label: "Preferences", percentage: 40, completed: false },
];

export default function UserAccountProgress({
  items,
  onImproveProfile,
}: UserAccountProgressProps) {
  const data = items || defaultItems;

  // Calculate overall completion
  const overallCompletion = Math.round(
    data.reduce((acc, item) => acc + item.percentage, 0) / data.length
  );

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Account Progress</h3>
        <span className="text-sm font-medium text-blue-600">{overallCompletion}%</span>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    item.completed ? "text-gray-900" : "text-gray-600"
                  )}
                >
                  {item.label}
                </span>
              </div>
              <span className="text-xs text-gray-500">{item.percentage}%</span>
            </div>
            <Progress
              value={item.percentage}
              className="h-2 bg-gray-100"
            />
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-6 border-blue-300 text-blue-600 hover:bg-blue-50"
        onClick={onImproveProfile}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Improve Profile
      </Button>
    </Card>
  );
}
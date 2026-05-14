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

interface BusinessAccountProgressProps {
  items?: ProgressItem[];
  isLoading?: boolean;
  onImproveProfile?: () => void;
}

export default function BusinessAccountProgress({
  items,
  isLoading = false,
  onImproveProfile,
}: BusinessAccountProgressProps) {
  const data = items || [];

  // Calculate overall completion
  const overallCompletion = data.length > 0
    ? Math.round(data.reduce((acc, item) => acc + item.percentage, 0) / data.length)
    : 0;

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-8 bg-gray-200 rounded" />
              </div>
              <div className="h-2 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-4 h-10 bg-gray-200 rounded" />
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6 bg-white border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Account Progress</h3>
          <span className="text-sm font-medium text-blue-600">{overallCompletion}%</span>
        </div>
        <div className="text-center text-gray-400 py-8">
          <p>No progress data available</p>
        </div>
      </Card>
    );
  }

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

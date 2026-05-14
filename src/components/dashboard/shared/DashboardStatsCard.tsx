import React from "react";
import { cn } from "@/lib/utils";

interface DashboardStatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  trend?: {
    value: string;
    type: "positive" | "negative" | "neutral";
  };
  isLoading?: boolean;
}

export default function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  isLoading = false,
}: DashboardStatsCardProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-none rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
          <div className="flex items-baseline mt-2">
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? "-" : typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {trend && (
              <span
                className={cn(
                  "ml-2 text-xs font-medium",
                  trend.type === "positive" && "text-green-600",
                  trend.type === "negative" && "text-red-600",
                  trend.type === "neutral" && "text-gray-600"
                )}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </div>
  );
}
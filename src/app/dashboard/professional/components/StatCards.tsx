"use client";

import React from "react";
import { Eye, MessageSquare, FolderKanban, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  trend?: "up" | "down" | "neutral";
}

function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last 7 days",
  icon,
  iconBgColor = "bg-blue-100",
  trend = "neutral",
}: StatCardProps) {
  const isPositive = trend === "up" || (change && change > 0);
  const isNegative = trend === "down" || (change && change < 0);

  return (
    <Card className="p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && <TrendingUp className="h-3.5 w-3.5 text-green-500" />}
              {isNegative && <TrendingDown className="h-3.5 w-3.5 text-red-500" />}
              <span
                className={cn(
                  "text-xs font-medium",
                  isPositive && "text-green-600",
                  isNegative && "text-red-600",
                  !isPositive && !isNegative && "text-gray-500"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-gray-400">{changeLabel}</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            iconBgColor
          )}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface StatsData {
  profileViews: number;
  profileViewsChange: number;
  enquiries: number;
  enquiriesChange: number;
  projectsViews: number;
  projectsViewsChange: number;
  reviews: number;
  reviewsChange: number;
  profileStrength: number;
}

interface StatCardsProps {
  stats?: StatsData;
  isLoading?: boolean;
}

export default function StatCards({ stats, isLoading = false }: StatCardsProps) {
  const defaultStats: StatsData = {
    profileViews: 9876,
    profileViewsChange: 16.2,
    enquiries: 842,
    enquiriesChange: 10.6,
    projectsViews: 1245,
    projectsViewsChange: 12.5,
    reviews: 24,
    reviewsChange: 0.7,
    profileStrength: 85,
  };

  const data = stats || defaultStats;

  const statItems: StatCardProps[] = [
    {
      title: "Profile Views",
      value: data.profileViews.toLocaleString(),
      change: data.profileViewsChange,
      icon: <Eye className="h-5 w-5 text-blue-600" />,
      iconBgColor: "bg-blue-50",
      trend: data.profileViewsChange > 0 ? "up" : "down",
    },
    {
      title: "Enquiries",
      value: data.enquiries.toLocaleString(),
      change: data.enquiriesChange,
      icon: <MessageSquare className="h-5 w-5 text-emerald-600" />,
      iconBgColor: "bg-emerald-50",
      trend: data.enquiriesChange > 0 ? "up" : "down",
    },
    {
      title: "Projects Views",
      value: data.projectsViews.toLocaleString(),
      change: data.projectsViewsChange,
      icon: <FolderKanban className="h-5 w-5 text-cyan-600" />,
      iconBgColor: "bg-cyan-50",
      trend: data.projectsViewsChange > 0 ? "up" : "down",
    },
    {
      title: "Reviews",
      value: data.reviews.toLocaleString(),
      change: data.reviewsChange,
      icon: <Star className="h-5 w-5 text-amber-600" />,
      iconBgColor: "bg-amber-50",
      trend: data.reviewsChange > 0 ? "up" : "down",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

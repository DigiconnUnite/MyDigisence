"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChartData {
  date: string;
  views: number;
}

type TimeRange = "week" | "month" | "year";

interface ProfileViewsChartProps {
  data?: ChartData[];
  dataByRange?: Record<TimeRange, ChartData[]>;
  isLoading?: boolean;
}

const defaultWeekData: ChartData[] = [
  { date: "May 20", views: 2000 },
  { date: "May 21", views: 3500 },
  { date: "May 22", views: 3200 },
  { date: "May 23", views: 4500 },
  { date: "May 24", views: 3800 },
  { date: "May 25", views: 5200 },
  { date: "May 26", views: 5800 },
];

const defaultMonthData: ChartData[] = [
  { date: "Week 1", views: 15000 },
  { date: "Week 2", views: 22000 },
  { date: "Week 3", views: 28000 },
  { date: "Week 4", views: 32000 },
];

const defaultYearData: ChartData[] = [
  { date: "Jan", views: 45000 },
  { date: "Feb", views: 52000 },
  { date: "Mar", views: 48000 },
  { date: "Apr", views: 61000 },
  { date: "May", views: 58000 },
  { date: "Jun", views: 72000 },
];

export default function ProfileViewsChart({
  data,
  dataByRange,
  isLoading = false,
}: ProfileViewsChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  const chartData =
    dataByRange?.[timeRange] ||
    data ||
    (timeRange === "week" ? defaultWeekData : timeRange === "month" ? defaultMonthData : defaultYearData);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-bold text-gray-900">
            {payload[0].value.toLocaleString()} views
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-8 w-32 bg-gray-200 rounded" />
        </div>
        <div className="h-64 bg-gray-200 rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Views Overview</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Track your profile visibility over time
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant="ghost"
              size="sm"
              onClick={() => setTimeRange(range.value)}
              className={cn(
                "text-xs px-3 py-1.5 h-auto rounded-md transition-all",
                timeRange === range.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-transparent"
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString()
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="views"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#viewsGradient)"
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

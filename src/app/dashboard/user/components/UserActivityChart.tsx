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
  activity: number;
}

type TimeRange = "week" | "month";

interface UserActivityChartProps {
  data?: ChartData[];
  dataByRange?: Record<TimeRange, ChartData[]>;
}

const defaultWeekData: ChartData[] = [
  { date: "Mon", activity: 2 },
  { date: "Tue", activity: 5 },
  { date: "Wed", activity: 3 },
  { date: "Thu", activity: 8 },
  { date: "Fri", activity: 6 },
  { date: "Sat", activity: 1 },
  { date: "Sun", activity: 4 },
];

const defaultMonthData: ChartData[] = [
  { date: "Week 1", activity: 15 },
  { date: "Week 2", activity: 22 },
  { date: "Week 3", activity: 18 },
  { date: "Week 4", activity: 25 },
];

export default function UserActivityChart({
  data,
  dataByRange,
}: UserActivityChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  const chartData =
    dataByRange?.[timeRange] ||
    data ||
    (timeRange === "week" ? defaultWeekData : defaultMonthData);

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
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
            {payload[0].value} activities
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Track your inquiry and interaction activity
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
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
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
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="activity"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#activityGradient)"
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
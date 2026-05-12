"use client";

import React from "react";
import { memo } from "react";
import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../components/StatCard";

interface AnalyticsViewProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
    profileViews: number;
  };
}

export default memo(function AnalyticsView({ stats }: AnalyticsViewProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Business Analytics
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Track your business performance and metrics
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Profile Views"
          value={stats.profileViews.toString()}
          subtitle="Total views"
          icon={<Eye className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Product Views"
          value={stats.totalProducts.toString()}
          subtitle="Total views"
          icon={<BarChart3 className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Inquiries"
          value={stats.totalInquiries.toString()}
          subtitle={`${stats.newInquiries} new`}
          icon={<Users className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Growth Rate"
          value="+12%"
          subtitle="This month"
          icon={<TrendingUp className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {/* Analytics Charts Placeholder */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Your business metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-3xl">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Analytics charts coming soon</p>
              <p className="text-xs text-gray-400 mt-1">Detailed analytics will be available here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Most viewed products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-medium text-gray-900">Product A</span>
                <span className="text-sm text-gray-600">1,234 views</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-medium text-gray-900">Product B</span>
                <span className="text-sm text-gray-600">987 views</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-medium text-gray-900">Product C</span>
                <span className="text-sm text-gray-600">756 views</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-medium text-gray-900">New inquiry</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-medium text-gray-900">Product view</span>
                <span className="text-xs text-gray-500">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <span className="text-sm font-medium text-gray-900">Profile visit</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

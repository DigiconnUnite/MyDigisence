"use client";

import React from "react";
import { memo } from "react";
import { Package, Mail, Building, BarChart3 } from "lucide-react";
import StatCard from "./StatCard";

interface BusinessStatCardsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
  };
}

export default memo(function BusinessStatCards({ stats }: BusinessStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard
        title="Total Products"
        value={stats.totalProducts.toString()}
        subtitle={`${stats.activeProducts} active`}
        icon={<Package className="h-4 w-4 text-gray-400" />}
      />
      <StatCard
        title="Total Inquiries"
        value={stats.totalInquiries.toString()}
        subtitle={`${stats.newInquiries} new`}
        icon={<Mail className="h-4 w-4 text-gray-400" />}
      />
      <StatCard
        title="Business Status"
        value="Active"
        subtitle="Current status"
        icon={<Building className="h-4 w-4 text-gray-400" />}
      />
      <StatCard
        title="Profile Health"
        value="Good"
        subtitle="System status"
        icon={<BarChart3 className="h-4 w-4 text-gray-400" />}
      />
    </div>
  );
});

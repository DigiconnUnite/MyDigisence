"use client";

import React from "react";
import { memo } from "react";
import { BarChart3, Users, Eye, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../components/StatCard";
import type { Inquiry, Product } from "../types";

interface AnalyticsViewProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
    profileViews: number;
  };
  products: Product[];
  inquiries: Inquiry[];
}

export default memo(function AnalyticsView({ stats, products, inquiries }: AnalyticsViewProps) {
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

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
          title="Products"
          value={stats.totalProducts.toString()}
          subtitle={`${stats.activeProducts} active`}
          icon={<BarChart3 className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Inquiries"
          value={stats.totalInquiries.toString()}
          subtitle={`${stats.newInquiries} new`}
          icon={<Users className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts.toString()}
          subtitle="Live catalog"
          icon={<Package className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest catalog updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No products yet.</p>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <span className="text-sm font-medium text-gray-900">
                      {product.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-gray-500">No inquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                    <span className="text-sm font-medium text-gray-900">
                      {inquiry.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

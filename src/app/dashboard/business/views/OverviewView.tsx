"use client";

import React from "react";
import { Eye, Building, Package, Mail, Plus, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "../components/StatCard";
import ActionCard from "../components/ActionCard";
import type { Business, Inquiry } from "../types";

interface OverviewViewProps {
  business: Business | null;
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
  };
  inquiries: Inquiry[];
  heroSlidesCount: number;
  onNavigateToProducts: () => void;
  onNavigateToInfo: () => void;
  onNavigateToInquiries: () => void;
  onOpenCatalogPreview: () => void;
}

export default function OverviewView({
  business,
  stats,
  inquiries,
  heroSlidesCount,
  onNavigateToProducts,
  onNavigateToInfo,
  onNavigateToInquiries,
  onOpenCatalogPreview,
}: OverviewViewProps) {
  const getProfileCompletion = () => {
    const keys = [
      business?.name ? 25 : 0,
      business?.description ? 25 : 0,
      business?.logo ? 25 : 0,
      business?.address ? 25 : 0,
      business?.phone ? 25 : 0,
      business?.email != null ? 25 : 0,
      business?.website ? 25 : 0,
      heroSlidesCount > 0 ? 25 : 0,
    ];

    const percent = Math.min(keys.reduce((sum, value) => sum + value, 0), 100);
    return `${percent}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Business Dashboard Overview
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Welcome back! Here's your business profile overview.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          title="Profile Completion"
          value={getProfileCompletion()}
          subtitle="Profile completion"
          icon={<Eye className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Business Health"
          value={business?.isActive ? "Active" : "Inactive"}
          subtitle="Current status"
          icon={<Building className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActionCard
          title="Add New Product"
          description="Add a new product to your catalog"
          icon={<Plus className="h-5 w-5" />}
          buttonText="Add Product"
          buttonAction={onNavigateToProducts}
        />
        <ActionCard
          title="View Catalog"
          description="Preview your public business catalog"
          icon={<ExternalLink className="h-5 w-5" />}
          buttonText="View Public Catalog"
          buttonAction={onOpenCatalogPreview}
          disabled={!business?.slug}
          variant="outline"
        />
        <ActionCard
          title="Update Business Profile"
          description="Edit your business information and settings"
          icon={<Settings className="h-5 w-5" />}
          buttonText="Edit Profile"
          buttonAction={onNavigateToInfo}
          variant="outline"
        />
        <ActionCard
          title="Check Inquiries"
          description="Review and respond to customer inquiries"
          icon={<Mail className="h-5 w-5" />}
          buttonText="View Inquiries"
          buttonAction={onNavigateToInquiries}
          variant="outline"
        />
      </div>

      {/* Recent Activity */}
      <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inquiries.slice(0, 3).map((inquiry) => (
              <div
                key={inquiry.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl"
              >
                <div className="shrink-0">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    New inquiry from {inquiry.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                    inquiry.status === "NEW"
                      ? "bg-red-500/10 border-red-500/30 text-red-600"
                      : inquiry.status === "READ"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-700"
                        : inquiry.status === "REPLIED"
                          ? "bg-green-500/10 border-green-500/30 text-green-700"
                          : "bg-gray-500/10 border-gray-500/30 text-gray-600"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      inquiry.status === "NEW"
                        ? "bg-red-500"
                        : inquiry.status === "READ"
                          ? "bg-blue-500"
                          : inquiry.status === "REPLIED"
                            ? "bg-green-500"
                            : "bg-gray-500"
                    }`}
                  ></span>
                  {inquiry.status === "NEW"
                    ? "New"
                    : inquiry.status === "READ"
                      ? "Read"
                      : inquiry.status === "REPLIED"
                        ? "Replied"
                        : "Closed"}
                </div>
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

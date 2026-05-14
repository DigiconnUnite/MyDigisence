"use client";

import React from "react";
import {
  Eye,
  Building,
  Package,
  Mail,
  TrendingUp,
  BarChart3,
  Pencil,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuickActions from "../components/QuickActions";
import type { Business, Inquiry } from "../types";

interface OverviewViewProps {
  business: Business | null;
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
    profileViews: number;
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
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Overview</h1>
        <p className="text-md text-gray-600">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.profileViews.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Total views</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Customer Inquiries</CardTitle>
                <Mail className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalInquiries.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">{stats.newInquiries} new</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Products</CardTitle>
                <Package className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">{stats.activeProducts} active</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Profile Completion</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {getProfileCompletion()}
                </div>
                <p className="text-xs text-gray-500">Keep improving</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <CardHeader>
              <CardTitle className="text-base">Profile Views Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 rounded-2xl bg-gray-50 flex items-center justify-center text-sm text-gray-500">
                <BarChart3 className="h-5 w-5 mr-2" />
                Views tracking is enabled and will chart here.
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
              <CardHeader>
                <CardTitle className="text-base">Product Snapshot</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.totalProducts === 0 ? (
                  <p className="text-sm text-gray-500">No products added yet.</p>
                ) : (
                  <p className="text-sm text-gray-600">
                    You have {stats.totalProducts} products, {stats.activeProducts} active.
                  </p>
                )}
                <div className="mt-4">
                  <Button variant="outline" onClick={onNavigateToProducts} className="rounded-xl">
                    Manage Products
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
              <CardHeader>
                <CardTitle className="text-base">Business Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-4 w-4 text-gray-400" />
                  {business?.isActive ? "Active" : "Inactive"}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Keep your profile updated to stay visible.
                </p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={onNavigateToInfo} className="rounded-xl">
                    Update Profile
                  </Button>
                  <Button variant="outline" onClick={onOpenCatalogPreview} className="rounded-xl">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <CardHeader>
              <CardTitle className="text-base">Recent Inquiries</CardTitle>
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
                        {inquiry.name}
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
                      {inquiry.status}
                    </div>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent inquiries
                  </p>
                )}
              </div>
              <div className="mt-4">
                <Button variant="outline" onClick={onNavigateToInquiries} className="rounded-xl">
                  View All Inquiries
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <CardHeader>
              <CardTitle className="text-base">Business Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{business?.name || "Your Business"}</p>
                  <p className="text-xs text-gray-500">{business?.category?.name || "No category"}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={onNavigateToInfo} className="rounded-xl">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={onOpenCatalogPreview} className="rounded-xl">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <CardHeader>
              <CardTitle className="text-base">Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{getProfileCompletion()} complete</p>
              <p className="text-xs text-gray-500 mt-2">
                Add more details to improve visibility.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActions
                onNavigateToProducts={onNavigateToProducts}
                onNavigateToInfo={onNavigateToInfo}
                onNavigateToInquiries={onNavigateToInquiries}
                onOpenCatalogPreview={onOpenCatalogPreview}
                hasBusinessSlug={!!business?.slug}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

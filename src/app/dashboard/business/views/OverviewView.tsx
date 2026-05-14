"use client";

import React, { useMemo } from "react";
import { Eye, MessageSquare, Package, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProfileViewsChart from "../../professional/components/ProfileViewsChart";
import AccountProgress from "../../professional/components/AccountProgress";
import AccountSummary from "../../professional/components/AccountSummary";
import QuickActions from "../../professional/components/QuickActions";
import BusinessProfilePreview from "../components/BusinessProfilePreview";
import type { Business, Inquiry, ViewSeriesByRange } from "../types";

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
  viewSeries: ViewSeriesByRange | null;
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
  viewSeries,
  onNavigateToProducts,
  onNavigateToInfo,
  onNavigateToInquiries,
  onOpenCatalogPreview,
}: OverviewViewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const completionItems = useMemo(() => {
    if (!business) {
      return [];
    }

    const items = [
      { label: "Profile Information", percentage: business.name ? 100 : 0, completed: !!business.name },
      { label: "Logo", percentage: business.logo ? 100 : 0, completed: !!business.logo },
      { label: "About Section", percentage: business.description ? 100 : 0, completed: !!business.description },
      { label: "Products", percentage: stats.totalProducts > 0 ? 100 : 40, completed: stats.totalProducts > 0 },
      { label: "Portfolio", percentage: heroSlidesCount > 0 ? 100 : 60, completed: heroSlidesCount > 0 },
      { label: "Reviews", percentage: business.totalReviews > 0 ? 100 : 60, completed: business.totalReviews > 0 },
    ];

    return items;
  }, [business, heroSlidesCount, stats.totalProducts]);

  const quickActions = [
    { id: "add-product", label: "Add Product", icon: Package, onClick: onNavigateToProducts, color: "bg-blue-50 text-blue-600" },
    { id: "view-catalog", label: "View Catalog", icon: TrendingUp, onClick: onOpenCatalogPreview, color: "bg-purple-50 text-purple-600" },
    { id: "edit-profile", label: "Edit Profile", icon: Star, onClick: onNavigateToInfo, color: "bg-pink-50 text-pink-600" },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare, onClick: onNavigateToInquiries, color: "bg-green-50 text-green-600" },
  ];

  const chartDataByRange = viewSeries ?? undefined;

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
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Profile Views</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.profileViews.toLocaleString()}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-blue-50">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Inquiries</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalInquiries.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs font-medium text-green-600">+{stats.newInquiries}</span>
                    <span className="text-xs text-gray-400">new</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-emerald-50">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Products</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stats.totalProducts.toLocaleString()}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-400">{stats.activeProducts} active</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-cyan-50">
                  <Package className="h-5 w-5 text-cyan-600" />
                </div>
              </div>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Reviews</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {business?.totalReviews?.toLocaleString() ?? 0}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-400">Avg {business?.averageRating?.toFixed(1) || "0.0"}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-amber-50">
                  <Star className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <ProfileViewsChart dataByRange={chartDataByRange} />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Snapshot</h3>
              <p className="text-sm text-gray-600">
                {stats.totalProducts === 0
                  ? "No products yet. Add your first product to improve visibility."
                  : `You have ${stats.totalProducts} products, ${stats.activeProducts} active.`}
              </p>
              <Button variant="outline" onClick={onNavigateToProducts} className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50">
                Manage Products
              </Button>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
              <div className="space-y-3">
                {inquiries.slice(0, 3).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inquiry.name}</p>
                      <p className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        inquiry.status === "NEW" && "bg-red-100 text-red-700",
                        inquiry.status === "READ" && "bg-blue-100 text-blue-700",
                        inquiry.status === "REPLIED" && "bg-green-100 text-green-700",
                        inquiry.status === "CLOSED" && "bg-gray-100 text-gray-600"
                      )}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <p className="text-sm text-gray-500">No recent inquiries.</p>
                )}
              </div>
              <Button variant="outline" onClick={onNavigateToInquiries} className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50">
                View All Inquiries
              </Button>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <BusinessProfilePreview
              business={{
                name: business?.name,
                category: business?.category?.name,
                location: business?.address || "Location not set",
                description: business?.description || "Add a description to attract more customers.",
                logo: business?.logo,
                isVerified: business?.isVerified,
              }}
              stats={{
                products: stats.totalProducts,
                inquiries: stats.totalInquiries,
                rating: business?.averageRating ?? 0,
                years: business?.yearsInBusiness,
              }}
              onViewProfile={onOpenCatalogPreview}
              onEditProfile={onNavigateToInfo}
            />
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <AccountProgress
              items={completionItems}
              onImproveProfile={onNavigateToInfo}
            />
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <AccountSummary
              memberSince={business?.createdAt ? new Date(business.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "-"}
              plan="Business Plan"
              status={business?.isActive ? "active" : "inactive"}
              nextBillingDate="-"
              onManageSubscription={onNavigateToInfo}
            />
          </Card>

          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <QuickActions actions={quickActions} />
          </Card>
        </div>
      </div>
    </div>
  );
}

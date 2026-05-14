// app/dashboard/business/views/OverviewView.tsx
"use client";

import React, { useMemo } from "react";
import { Eye, MessageSquare, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DashboardStatsCard from "@/components/dashboard/shared/DashboardStatsCard";
import BusinessProfileViewsChart from "../components/BusinessProfileViewsChart";
import BusinessAccountProgress from "../components/BusinessAccountProgress";
import BusinessAccountSummary from "../components/BusinessAccountSummary";
import QuickActions from "../components/QuickActions";
import BusinessProfilePreview from "../components/BusinessProfilePreview";
import type { Business, Inquiry, ViewSeriesByRange } from "../types";

// ─── Consistent card wrapper class ──────────────────────────────────
const CARD = "bg-white border border-gray-200 shadow-none rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md";

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
  isLoading?: boolean;
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
  isLoading = false,
  onNavigateToProducts,
  onNavigateToInfo,
  onNavigateToInquiries,
  onOpenCatalogPreview,
}: OverviewViewProps) {
  // ─── Helpers ──────────────────────────────────────────────────────
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // ─── Account completion items ─────────────────────────────────────
  const completionItems = useMemo(() => {
    if (!business) return [];
    return [
      { label: "Profile Information", percentage: business.name ? 100 : 0, completed: !!business.name },
      { label: "Logo", percentage: business.logo ? 100 : 0, completed: !!business.logo },
      { label: "About Section", percentage: business.description ? 100 : 0, completed: !!business.description },
      { label: "Products", percentage: stats.totalProducts > 0 ? 100 : 0, completed: stats.totalProducts > 0 },
      { label: "Portfolio", percentage: heroSlidesCount > 0 ? 100 : 0, completed: heroSlidesCount > 0 },
      { label: "Reviews", percentage: (business.totalReviews ?? 0) > 0 ? 100 : 0, completed: (business.totalReviews ?? 0) > 0 },
    ];
  }, [business, heroSlidesCount, stats.totalProducts]);

  // ─── Quick actions ────────────────────────────────────────────────
  const quickActions = useMemo(
    () => [
      { id: "add-product", label: "Add Product", icon: Package, onClick: onNavigateToProducts, color: "bg-blue-50 text-blue-600" },
      { id: "view-catalog", label: "View Catalog", icon: Eye, onClick: onOpenCatalogPreview, color: "bg-violet-50 text-violet-600" },
      { id: "edit-profile", label: "Edit Profile", icon: Star, onClick: onNavigateToInfo, color: "bg-amber-50 text-amber-600" },
      { id: "inquiries", label: "Inquiries", icon: MessageSquare, onClick: onNavigateToInquiries, color: "bg-emerald-50 text-emerald-600" },
    ],
    [onNavigateToProducts, onOpenCatalogPreview, onNavigateToInfo, onNavigateToInquiries]
  );

  // ─── Chart data ───────────────────────────────────────────────────
  const chartDataByRange = viewSeries ?? undefined;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your business.
        </p>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatsCard
          title="Profile Views"
          value={stats.profileViews}
          subtitle="This month"
          icon={Eye}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          isLoading={isLoading}
        />
        <DashboardStatsCard
          title="Inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend={{ value: `+${stats.newInquiries}`, type: "positive" }}
          subtitle="new"
          isLoading={isLoading}
        />
        <DashboardStatsCard
          title="Products"
          value={stats.totalProducts}
          subtitle={`${stats.activeProducts} active`}
          icon={Package}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
          isLoading={isLoading}
        />
        <DashboardStatsCard
          title="Reviews"
          value={business?.totalReviews ?? 0}
          subtitle={`Avg ${business?.averageRating?.toFixed(1) ?? "0.0"}`}
          icon={Star}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          isLoading={isLoading}
        />
      </div>

      {/* ── Main Content Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Left Column (2/3) ────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-6">
          {/* Chart */}
          <div className={CARD}>
            <BusinessProfileViewsChart dataByRange={chartDataByRange} />
          </div>

          {/* Two-Column Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Snapshot */}
            <div className={`${CARD} p-6`}>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Product Snapshot
              </h3>
              <p className="text-sm text-gray-500">
                {stats.totalProducts === 0
                  ? "No products yet. Add your first product to improve visibility."
                  : `You have ${stats.totalProducts} products, ${stats.activeProducts} active.`}
              </p>
              <Button
                variant="outline"
                onClick={onNavigateToProducts}
                className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                Manage Products
              </Button>
            </div>

            {/* Recent Inquiries */}
            <div className={`${CARD} p-6`}>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Recent Inquiries
              </h3>
              <div className="space-y-3">
                {inquiries.length === 0 && (
                  <p className="text-sm text-gray-400">No recent inquiries.</p>
                )}
                {inquiries.slice(0, 3).map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {inquiry.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-2.5 py-0.5 rounded-full ml-3 shrink-0",
                        inquiry.status === "NEW" && "bg-red-50 text-red-600",
                        inquiry.status === "READ" && "bg-blue-50 text-blue-600",
                        inquiry.status === "REPLIED" && "bg-green-50 text-green-600",
                        inquiry.status === "CLOSED" && "bg-gray-100 text-gray-500"
                      )}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={onNavigateToInquiries}
                className="mt-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              >
                View All Inquiries
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right Column (1/3) ───────────────────────────────────── */}
        <div className="space-y-6">
          <div className={CARD}>
            <BusinessProfilePreview
              business={{
                name: business?.name,
                category: business?.category?.name,
                location: business?.address || "Location not set",
                description:
                  business?.description ||
                  "Add a description to attract more customers.",
                logo: business?.logo,
                isVerified: business?.isVerified,
              }}
              stats={{
                products: stats.totalProducts,
                inquiries: stats.totalInquiries,
                rating: business?.averageRating ?? 0,
                years: business?.yearsInBusiness?.toString() ?? "0",
              }}
              onViewProfile={onOpenCatalogPreview}
              onEditProfile={onNavigateToInfo}
            />
          </div>

          <div className={CARD}>
            <BusinessAccountProgress
              items={completionItems}
              onImproveProfile={onNavigateToInfo}
            />
          </div>

          <div className={CARD}>
            <BusinessAccountSummary
              memberSince={
                business?.createdAt
                  ? new Date(business.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                  : "—"
              }
              plan="Business Plan"
              status={business?.isActive ? "active" : "inactive"}
              nextBillingDate="—"
              onManageSubscription={onNavigateToInfo}
            />
          </div>

          <div className={CARD}>
            <QuickActions
              onNavigateToProducts={onNavigateToProducts}
              onNavigateToInfo={onNavigateToInfo}
              onNavigateToInquiries={onNavigateToInquiries}
              onOpenCatalogPreview={onOpenCatalogPreview}
              hasBusinessSlug={!!business?.slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Eye, MessageSquare, Briefcase, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileViewsChart from "../components/ProfileViewsChart";
import RecentEnquiries from "../components/RecentEnquiries";
import MyServices from "../components/MyServices";
import MyProjects from "../components/MyProjects";
import ProfilePreview from "../components/ProfilePreview";
import AccountProgress from "../components/AccountProgress";
import AccountSummary from "../components/AccountSummary";
import QuickActions from "../components/QuickActions";
import { useToast } from "@/hooks/use-toast";
import type { Professional, Service, PortfolioItem } from "../types/professional";

interface OverviewViewProps {
  professional?: Professional | null;
  services?: Service[];
  portfolio?: PortfolioItem[];
  isLoading?: boolean;
  onNavigate?: (view: string) => void;
}

interface DashboardStats {
  profileViews: number;
  inquiries: number;
}

export default function OverviewView({
  professional,
  services,
  portfolio,
  isLoading: initialLoading = false,
  onNavigate,
}: OverviewViewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    inquiries: 0,
  });

  useEffect(() => {
    setIsLoading(initialLoading);
  }, [initialLoading]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch analytics data
        const analyticsRes = await fetch('/api/professionals/analytics?timeRange=30d');
        const analyticsData = analyticsRes.ok ? await analyticsRes.json() : null;

        setStats({
          profileViews: analyticsData?.profileViews?.total || 0,
          inquiries: analyticsData?.inquiries?.total || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard stats",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  const handleViewAllEnquiries = () => onNavigate?.("enquiries");
  const handleViewAllServices = () => onNavigate?.("services");
  const handleViewAllProjects = () => onNavigate?.("projects");
  const handleAddService = () => onNavigate?.("add-service");
  const handleViewProfile = () => onNavigate?.("profile");
  const handleEditProfile = () => onNavigate?.("edit-profile");
  const handleImproveProfile = () => onNavigate?.("edit-profile");
  const handleManageSubscription = () => onNavigate?.("subscription");

  const completedProjects = portfolio?.length ?? 0;
  const activeServices = services?.length ?? 0;

  const previewStats = useMemo(() => ({
    projects: completedProjects,
  }), [completedProjects]);

  const previewProfessional = useMemo(() => {
    if (!professional) {
      return undefined;
    }

    return {
      id: professional.id,
      name: professional.name,
      headline: professional.professionalHeadline ?? "",
      location: professional.location ?? "",
      about: professional.aboutMe ?? "",
      avatar: professional.profilePicture ?? "",
      banner: professional.banner ?? "",
      isVerified: false,
      stats: previewStats,
    };
  }, [professional, previewStats]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Overview</h1>
        <p className="text-md text-gray-600">Welcome back! Here's what's happening with your profile.</p>
      </div>

      {/* Main Content Grid - Profile Card on Top */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6">
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Profile Views</CardTitle>
                <Eye className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : stats.profileViews.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Client Inquiries</CardTitle>
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : stats.inquiries.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Total received</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Active Services</CardTitle>
                <Briefcase className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : activeServices}
                </div>
                <p className="text-xs text-gray-500">Currently listed</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Projects </CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoading ? '-' : completedProjects}
                </div>
                <p className="text-xs text-gray-500">Total delivered</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <ProfileViewsChart isLoading={isLoading} />
          </Card>

          {/* Two Column Layout for Services and Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
              <MyServices
                services={services}
                isLoading={isLoading}
                onViewAll={handleViewAllServices}
                onAddService={handleAddService}
              />
            </Card>
            <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
              <MyProjects
                portfolio={portfolio}
                isLoading={isLoading}
                onViewAll={handleViewAllProjects}
              />
            </Card>
          </div>

          {/* Recent Enquiries */}
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <RecentEnquiries
              isLoading={isLoading}
              onViewAll={handleViewAllEnquiries}
            />
          </Card>
        </div>

        {/* Right Column (1/3) - Profile Cards at Top */}
        <div className="space-y-6">
          {/* Profile Preview */}
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <ProfilePreview
              professional={previewProfessional}
              isLoading={isLoading}
              onViewProfile={handleViewProfile}
              onEditProfile={handleEditProfile}
            />
          </Card>

          {/* Account Progress */}
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <AccountProgress
              isLoading={isLoading}
              onImproveProfile={handleImproveProfile}
            />
          </Card>

          {/* Account Summary */}
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <AccountSummary
              isLoading={isLoading}
              onManageSubscription={handleManageSubscription}
            />
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white border border-gray-300 overflow-hidden shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg p-0">
            <QuickActions isLoading={isLoading} />
          </Card>
        </div>
      </div>
    </div>
  );
}

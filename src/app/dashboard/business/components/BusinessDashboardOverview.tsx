import {
  BarChart3,
  Building,
  Mail,
  Package,
  Plus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Business, Inquiry, ProductFormData } from "../types";

interface BusinessDashboardOverviewProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalInquiries: number;
    newInquiries: number;
  };
  business: Business;
  heroSlidesCount: number;
  inquiries: Inquiry[];
  formatDate: (dateString: string) => string;
  onNavigateToProducts: () => void;
  onNavigateToInfo: () => void;
  onNavigateToInquiries: () => void;
}

export function BusinessDashboardOverview({
  stats,
  business,
  heroSlidesCount,
  inquiries,
  formatDate,
  onNavigateToProducts,
  onNavigateToInfo,
  onNavigateToInquiries,
}: BusinessDashboardOverviewProps) {
  const getProfileCompletion = () => {
    const keys = [
      business.name ? 25 : 0,
      business.description ? 25 : 0,
      business.logo ? 25 : 0,
      business.address ? 25 : 0,
      business.phone ? 25 : 0,
      business.email != null ? 25 : 0,
      business.website ? 25 : 0,
      heroSlidesCount > 0 ? 25 : 0,
    ];

    const percent = Math.min(
      keys.reduce((sum, value) => sum + value, 0),
      100,
    );

    return `${percent}%`;
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-gray-500">{stats.activeProducts} active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Total Inquiries
            </CardTitle>
            <Mail className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalInquiries}
            </div>
            <p className="text-xs text-gray-500">{stats.newInquiries} new</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Profile Completion
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {getProfileCompletion()}
            </div>
            <p className="text-xs text-gray-500">Profile completion</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">
              Business Health
            </CardTitle>
            <Building className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {business.isActive ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-gray-500">Status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="default"
              onClick={onNavigateToProducts}
              className="rounded-xl  text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button
              variant="outline"
              onClick={onNavigateToInfo}
              className="w-full justify-start rounded-2xl"
            >
              <Settings className="h-4 w-4 mr-2" />
              Update Business Profile
            </Button>
            <Button
              variant="outline"
              onClick={onNavigateToInquiries}
              className="w-full justify-start rounded-2xl"
            >
              <Mail className="h-4 w-4 mr-2" />
              Check New Inquiries
            </Button>
          </CardContent>
        </Card>

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
    </>
  );
}

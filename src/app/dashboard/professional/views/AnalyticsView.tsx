"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  MessageSquare,
  Calendar,
  Download,
  Filter,
  ArrowUpDown,
  Activity,
  Clock,
  Star,
  Briefcase,
  Award
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsViewProps {
  isLoading?: boolean;
}

interface AnalyticsData {
  profileViews: {
    daily: Array<{ date: string; views: number; unique: number }>;
    monthly: Array<{ month: string; views: number; unique: number }>;
    total: number;
    trend: "up" | "down" | "stable";
    percentage: number;
  };
  inquiries: {
    daily: Array<{ date: string; count: number; converted: number }>;
    monthly: Array<{ month: string; count: number; converted: number }>;
    total: number;
    conversionRate: number;
    trend: "up" | "down" | "stable";
    percentage: number;
  };
  services: {
    views: Array<{ name: string; views: number; inquiries: number }>;
    performance: Array<{ name: string; revenue: number; bookings: number }>;
  };
  audience: {
    demographics: Array<{ age: string; percentage: number }>;
    locations: Array<{ city: string; percentage: number }>;
    devices: Array<{ device: string; percentage: number }>;
  };
  engagement: {
    responseTime: number;
    rating: number;
    reviews: number;
    appointments: number;
  };
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export default function AnalyticsView({ isLoading = false }: AnalyticsViewProps) {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");
  const [selectedMetric, setSelectedMetric] = useState<"views" | "inquiries" | "revenue">("views");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/professionals/analytics?timeRange=${timeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        
        // Transform API data to match component interface
        setAnalyticsData({
          profileViews: {
            daily: data.profileViews?.daily || [],
            monthly: data.profileViews?.monthly || [],
            total: data.profileViews?.total || 0,
            trend: data.profileViews?.trend || "stable",
            percentage: data.profileViews?.percentage || 0,
          },
          inquiries: {
            daily: data.inquiries?.daily || [],
            monthly: data.inquiries?.monthly || [],
            total: data.inquiries?.total || 0,
            conversionRate: data.inquiries?.conversionRate || 0,
            trend: data.inquiries?.trend || "stable",
            percentage: data.inquiries?.percentage || 0,
          },
          services: {
            views: data.services?.views || [],
            performance: data.services?.performance || [],
          },
          audience: {
            demographics: data.audience?.demographics || [],
            locations: data.audience?.locations || [],
            devices: data.audience?.devices || [],
          },
          engagement: {
            responseTime: data.engagement?.responseTime || 0,
            rating: data.engagement?.rating || 0,
            reviews: data.engagement?.reviews || 0,
            appointments: data.engagement?.appointments || 0,
          },
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      }
    };

    fetchAnalytics();
  }, [timeRange, toast]);

  const exportData = () => {
    // Implement export functionality
    console.log("Exporting analytics data...");
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-sm text-gray-500 mt-1">Track your profile performance and client engagement</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-sm text-gray-500 mt-1">Track your profile performance and client engagement</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.profileViews.total.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {analyticsData.profileViews.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    analyticsData.profileViews.trend === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {analyticsData.profileViews.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.inquiries.total}
                </p>
                <div className="flex items-center mt-2">
                  {analyticsData.inquiries.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    analyticsData.inquiries.trend === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {analyticsData.inquiries.percentage}%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.inquiries.conversionRate}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {Math.round(analyticsData.inquiries.total * analyticsData.inquiries.conversionRate / 100)} converted
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {analyticsData.engagement.rating}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {analyticsData.engagement.reviews} reviews
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Profile Views Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.profileViews.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Total Views"
                />
                <Area 
                  type="monotone" 
                  dataKey="unique" 
                  stackId="2" 
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                  name="Unique Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inquiries Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Inquiries & Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.inquiries.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Total Inquiries"
                />
                <Line 
                  type="monotone" 
                  dataKey="converted" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Converted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Service Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Service Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.services.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="bookings" fill="#10b981" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audience Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analyticsData.audience.demographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="percentage"
                >
                  {analyticsData.audience.demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analyticsData.audience.demographics.map((item, index) => (
                <div key={item.age} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.age}</span>
                  </div>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.audience.locations.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{location.city}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">
                      {location.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.audience.devices.map((device, index) => (
                <div key={device.device} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{device.device}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-10 text-right">
                      {device.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Engagement Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.engagement.responseTime}h
              </p>
              <p className="text-sm text-gray-500">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-3">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.engagement.rating}/5
              </p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-3">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.engagement.reviews}
              </p>
              <p className="text-sm text-gray-500">Total Reviews</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-3">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.engagement.appointments}
              </p>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

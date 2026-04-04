import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Building, FolderTree, User, UserCheck, Zap } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { AdminStats, Business, Professional } from "../types";

interface DashboardOverviewProps {
  stats: AdminStats;
  businesses: Business[];
  professionals: Professional[];
  registrationInquiries: any[];
  onAddBusiness: () => void;
  onAddProfessional: () => void;
  onAddCategory: () => void;
}

export default function DashboardOverview({
  stats,
  businesses,
  professionals,
  registrationInquiries,
  onAddBusiness,
  onAddProfessional,
  onAddCategory,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard Overview</h1>
        <p className="text-md text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Active Businesses</CardTitle>
            <Building className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeBusinesses}</div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Active Professionals</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeProfessionals}</div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Registration Requests</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</div>
            <p className="text-xs text-gray-500">Pending requests</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">System Status</CardTitle>
            <Activity className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.activeBusinesses > 0 || stats.activeProfessionals > 0 ? "Excellent" : "Growing"}
            </div>
            <p className="text-xs text-gray-500">Platform health</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-4 min-h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">New Businesses</CardTitle>
            <Building className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="flex-1 px-0 bg-white flex flex-col">
            <div className="overflow-x-auto flex-1">
              {businesses.length > 0 ? (
                <Table>
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="text-xs flex-1">Name</TableHead>
                      <TableHead className="text-xs w-auto">Category</TableHead>
                      <TableHead className="text-xs w-auto">Status</TableHead>
                      <TableHead className="text-xs w-auto">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businesses
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 4)
                      .map((business) => (
                        <TableRow key={business.id}>
                          <TableCell className="text-xs font-medium flex-1">
                            <div className="flex items-center gap-2 min-w-0">
                              {business.logo ? (
                                <img
                                  src={business.logo}
                                  alt={`${business.name} logo`}
                                  className="h-8 w-8 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <Building className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <span className="truncate">{business.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs w-auto">{business.category?.name || "N/A"}</TableCell>
                          <TableCell className="w-auto">
                            <div
                              className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                                business.isActive
                                  ? "bg-lime-500/10 border-lime-500/30 text-lime-700"
                                  : "bg-red-500/10 border-red-500/30 text-red-600"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  business.isActive ? "bg-lime-500" : "bg-red-500"
                                }`}
                              ></span>
                              {business.isActive ? "Active" : "Inactive"}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs w-auto">{new Date(business.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                  <Building className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-medium">No Data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col bg-linear-90 overflow-hidden text-black bg-[#080322] px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-4 min-h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">New Professionals</CardTitle>
            <User className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="flex-1 px-0 bg-white flex flex-col">
            <div className="overflow-x-auto flex-1">
              {professionals.length > 0 ? (
                <Table>
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="text-xs flex-1">Name</TableHead>
                      <TableHead className="text-xs w-auto">Profession</TableHead>
                      <TableHead className="text-xs w-auto">Status</TableHead>
                      <TableHead className="text-xs w-auto">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professionals
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 4)
                      .map((professional) => (
                        <TableRow key={professional.id}>
                          <TableCell className="text-xs font-medium flex-1">
                            <div className="flex items-center gap-2 min-w-0">
                              {professional.profilePicture ? (
                                <img
                                  src={professional.profilePicture}
                                  alt={`${professional.name} profile`}
                                  className="h-8 w-8 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                  <User className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <span className="truncate">{professional.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs w-auto max-w-[150px] truncate">
                            {professional.professionalHeadline || "N/A"}
                          </TableCell>
                          <TableCell className="w-auto">
                            <div
                              className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                                professional.isActive
                                  ? "bg-lime-500/10 border-lime-500/30 text-lime-700"
                                  : "bg-red-500/10 border-red-500/30 text-red-600"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  professional.isActive ? "bg-lime-500" : "bg-red-500"
                                }`}
                              ></span>
                              {professional.isActive ? "Active" : "Inactive"}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs w-auto">
                            {new Date(professional.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                  <User className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-medium">No Data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-6 min-h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Latest Registration Requests</CardTitle>
            <UserCheck className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="flex-1 px-0 bg-white flex flex-col">
            <div className="overflow-x-auto flex-1">
              {registrationInquiries.length > 0 ? (
                <Table>
                  <TableHeader className="">
                    <TableRow>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Business/Profession</TableHead>
                      <TableHead className="text-xs">Email</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrationInquiries
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map((inquiry) => (
                        <TableRow key={inquiry.id}>
                          <TableCell>
                            <div
                              className={`flex  items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit  ${
                                inquiry.type === "BUSINESS"
                                  ? "bg-blue-500/10 border-blue-500/30 text-blue-700"
                                  : "bg-purple-500/10 border-purple-500/30 text-purple-700"
                              }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  inquiry.type === "BUSINESS" ? "bg-blue-500" : "bg-purple-500"
                                }`}
                              ></span>
                              {inquiry.type === "BUSINESS" ? "B" : "P"}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-medium truncate">{inquiry.name}</TableCell>
                          <TableCell className="text-xs truncate">{inquiry.businessName || "N/A"}</TableCell>
                          <TableCell className="text-xs">{inquiry.email}</TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <StatusBadge
                                status={inquiry.status}
                                variant={
                                  inquiry.status === "PENDING"
                                    ? "warning"
                                    : inquiry.status === "COMPLETED"
                                      ? "success"
                                      : "error"
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                  <UserCheck className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-xs font-medium">No Registration Requests</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-2 min-h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Quick Actions</CardTitle>
            <Zap className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent className="flex-1 px-0  flex flex-col">
            <div className="space-y-3 p-4">
              <button
                onClick={onAddBusiness}
                className="w-full py-2.5 cursor-pointer px-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <Building className="h-4 w-4 mr-2" />
                Create Business
              </button>
              <button
                onClick={onAddProfessional}
                className="w-full py-2.5 px-4  cursor-pointer rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <User className="h-4 w-4 mr-2" />
                Create Professional
              </button>
              <button
                onClick={onAddCategory}
                className="w-full py-2.5 px-4 cursor-pointer rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <FolderTree className="h-4 w-4 mr-2" />
                Create Category
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

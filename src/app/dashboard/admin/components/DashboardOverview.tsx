import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  FolderTree,
  User,
  UserCheck,
  Activity,
  Zap,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { AdminStats, Business, Professional } from "../types";

interface DashboardOverviewProps {
  stats: AdminStats;
  businesses: Business[];
  professionals: Professional[];
  registrationInquiries: any[];
  searchTerm: string;
  onAddBusiness: () => void;
  onAddProfessional: () => void;
  onAddCategory: () => void;
}

export default function DashboardOverview({
  stats,
  businesses,
  professionals,
  registrationInquiries,
  searchTerm,
  onAddBusiness,
  onAddProfessional,
  onAddCategory,
}: DashboardOverviewProps) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const highlightText = (text?: string | null) => {
    const value = text || "";
    if (!normalizedSearch || !value) {
      return value || "N/A";
    }

    const escapedSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = value.split(new RegExp(`(${escapedSearch})`, "ig"));

    return parts.map((part, index) =>
      part.toLowerCase() === normalizedSearch ? (
        <mark key={`${part}-${index}`} className="rounded bg-amber-200 px-1 text-gray-900">
          {part}
        </mark>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      )
    );
  };

  const filteredBusinesses = useMemo(() => {
    if (!normalizedSearch) return businesses;
    return businesses.filter((business) => {
      return (
        business.name.toLowerCase().includes(normalizedSearch) ||
        business.admin.email.toLowerCase().includes(normalizedSearch) ||
        business.category?.name.toLowerCase().includes(normalizedSearch) ||
        business.description?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [businesses, normalizedSearch]);

  const filteredProfessionals = useMemo(() => {
    if (!normalizedSearch) return professionals;
    return professionals.filter((professional) => {
      return (
        professional.name.toLowerCase().includes(normalizedSearch) ||
        professional.admin.email.toLowerCase().includes(normalizedSearch) ||
        professional.professionalHeadline?.toLowerCase().includes(normalizedSearch) ||
        professional.location?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [normalizedSearch, professionals]);

  const filteredRegistrationInquiries = useMemo(() => {
    if (!normalizedSearch) return registrationInquiries;
    return registrationInquiries.filter((inquiry) => {
      return (
        inquiry.name?.toLowerCase().includes(normalizedSearch) ||
        inquiry.email?.toLowerCase().includes(normalizedSearch) ||
        inquiry.businessName?.toLowerCase().includes(normalizedSearch) ||
        inquiry.location?.toLowerCase().includes(normalizedSearch) ||
        inquiry.message?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [normalizedSearch, registrationInquiries]);

  const activeBusinessRate = stats.totalBusinesses > 0
    ? Math.round((stats.activeBusinesses / stats.totalBusinesses) * 100)
    : 0;
  const activeProfessionalRate = stats.totalProfessionals > 0
    ? Math.round((stats.activeProfessionals / stats.totalProfessionals) * 100)
    : 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard Overview</h1>
        <p className="text-md text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6">
        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Active Businesses</CardTitle>
            <Building className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeBusinesses}</div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Active Professionals</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.activeProfessionals}</div>
            <p className="text-xs text-gray-500">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900">Registration Requests</CardTitle>
            <UserCheck className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</div>
            <p className="text-xs text-gray-500">Pending requests</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
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

        <div className="flex flex-col xl:col-span-4">
          <div className="flex flex-row items-center gap-2 pb-2 pt-2">
            <Building className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">New Businesses</h3>
          </div>
          <Card className="flex flex-col overflow-hidden bg-white border border-gray-300 shadow-none rounded-xl p-0 transition-all duration-300 hover:shadow-lg min-h-full">
          <CardContent className="flex-1 px-0 bg-white flex flex-col">
            <div className="overflow-x-auto flex-1">
              {filteredBusinesses.length > 0 ? (
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      <TableHead className="text-xs text-gray-700 font-semibold flex-1">Name</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold w-auto">Category</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold w-auto">Status</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold w-auto">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBusinesses
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
                              <span className="truncate">{highlightText(business.name)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs w-auto">{highlightText(business.category?.name)}</TableCell>
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
                  <p className="text-xs font-medium">{normalizedSearch ? "No matching results" : "No Data"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        <div className="flex flex-col xl:col-span-4">
          <div className="flex flex-row items-center gap-2  pb-2 pt-2">
            <User className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">New Professionals</h3>
          </div>
          <Card className="flex flex-col overflow-hidden bg-white border border-gray-300 shadow-none rounded-xl p-0 transition-all duration-300 hover:shadow-lg min-h-full">
          <CardContent className="flex-1 px-0 bg-white flex flex-col">
            <div className="overflow-x-auto flex-1">
              {filteredProfessionals.length > 0 ? (
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      <TableHead className="text-xs text-gray-700 font-semibold flex-1">Name</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold w-auto">Profession</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold w-auto">Experience</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold w-auto">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfessionals
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
                              <span className="truncate">{highlightText(professional.name)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs w-auto max-w-[150px] truncate">
                            {highlightText(professional.professionalHeadline)}
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
        </div>

        <div className="flex flex-col mt-6 xl:col-span-6">
          <div className="flex flex-row items-center gap-2 pb-2 pt-2">
            <UserCheck className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Latest Registration Requests</h3>
          </div>
          <Card className="flex flex-col overflow-hidden bg-white border border-gray-300 shadow-none rounded-xl p-0 transition-all duration-300 hover:shadow-lg min-h-full">
          <CardContent className="flex-1 px-0 bg-white flex flex-col">
            <div className="overflow-x-auto flex-1">
              {filteredRegistrationInquiries.length > 0 ? (
                <Table>
                  <TableHeader className="bg-gray-50 border-b border-gray-200">
                    <TableRow>
                      <TableHead className="text-xs text-gray-700 font-semibold">Type</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold">Name</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold">Email</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold">Status</TableHead>
                      <TableHead className="text-xs text-gray-700 font-semibold">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrationInquiries
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
                          <TableCell className="text-xs font-medium truncate">{highlightText(inquiry.name)}</TableCell>
                          <TableCell className="text-xs">{highlightText(inquiry.email)}</TableCell>
                          <TableCell>
                            <div className="flex ">
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
        </div>

        <div className="flex flex-col mt-6 xl:col-span-2">
          <div className="flex flex-row items-center gap-2 pb-2 pt-2">
            <Zap className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-900">Quick Actions</h3>
          </div>
          <Card className="flex flex-col overflow-hidden bg-white border border-gray-300 shadow-none rounded-xl p-0 transition-all duration-300 hover:shadow-lg min-h-full">
          <CardContent className="flex-1 px-0 flex flex-col">
            <div className="space-y-3 p-4">
              <button
                onClick={onAddBusiness}
                className="w-full py-2.5 cursor-pointer px-4 rounded-full bg-gray-100 border border-gray-300 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
              >
                <Building className="h-4 w-4 mr-2" />
                Create Business
              </button>
              <button
                onClick={onAddProfessional}
                className="w-full py-2.5 px-4 cursor-pointer rounded-full bg-gray-100 border border-gray-300 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
              >
                <User className="h-4 w-4 mr-2" />
                Create Professional
              </button>
              <button
                onClick={onAddCategory}
                className="w-full py-2.5 px-4 cursor-pointer rounded-full bg-gray-100 border border-gray-300 text-gray-900 text-sm font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
              >
                <FolderTree className="h-4 w-4 mr-2" />
                Create Category
              </button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Edit2, Trash2, Eye, Wrench, MoreHorizontal,
  Filter, ArrowUpDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Service {
  id?: string;
  name: string;
  category?: string | null;
  description?: string | null;
  price?: number | string | null;
  currency?: string | null;
  status?: "active" | "inactive" | null;
  views?: number | null;
  inquiries?: number | null;
  createdAt?: string | null;
}

interface ServicesViewProps {
  services?: Service[];
  isLoading?: boolean;
  onAddService?: () => void;
  onEditService?: (id: string) => void;
  onDeleteService?: (id: string) => void;
  onViewService?: (id: string) => void;
}

export default function ServicesView({
  services,
  isLoading = false,
  onAddService,
  onEditService,
  onDeleteService,
  onViewService,
}: ServicesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "views">("name");

  const data = services || [];
  const getPriceValue = (value?: number | string | null) => {
    if (value == null) {
      return 0;
    }
    return typeof value === "number" ? value : Number(value) || 0;
  };

  const filteredServices = data
    .filter(s => 
      (statusFilter === "all" || (s.status || "active") === statusFilter) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (s.category || "").toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price") return getPriceValue(b.price) - getPriceValue(a.price);
      if (sortBy === "views") return (b.views || 0) - (a.views || 0);
      return a.name.localeCompare(b.name);
    });

  const stats = {
    total: data.length,
    active: data.filter(s => (s.status || "active") === "active").length,
    inactive: data.filter(s => s.status === "inactive").length,
    totalViews: data.reduce((acc, s) => acc + (s.views || 0), 0),
    totalInquiries: data.reduce((acc, s) => acc + (s.inquiries || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your service offerings</p>
        </div>
        <Button onClick={onAddService}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Services</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Inactive</p>
            <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Views</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Inquiries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {statusFilter === "all" ? "All Status" : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price")}>Price</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("views")}>Views</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="bg-white border border-gray-300 shadow-none rounded-3xl transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Services</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No services found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service, index) => (
                    <TableRow key={service.id || `${service.name}-${index}`} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{service.description || "-"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{service.category || "-"}</TableCell>
                      <TableCell>${getPriceValue(service.price).toLocaleString()}</TableCell>
                      <TableCell>
                        {(() => {
                          const status = service.status === "inactive" ? "inactive" : "active";
                          return (
                            <Badge 
                              className={cn(
                                status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                              )}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell>{(service.views || 0).toLocaleString()}</TableCell>
                      <TableCell>{service.inquiries || 0}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onViewService?.(service.id)}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEditService?.(service.id)}>
                              <Edit2 className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteService?.(service.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

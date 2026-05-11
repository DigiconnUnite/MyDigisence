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
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  status: "active" | "inactive";
  views: number;
  inquiries: number;
  createdAt: string;
}

interface ServicesViewProps {
  services?: Service[];
  isLoading?: boolean;
  onAddService?: () => void;
  onEditService?: (id: string) => void;
  onDeleteService?: (id: string) => void;
  onViewService?: (id: string) => void;
}

const defaultServices: Service[] = [
  { id: "1", name: "Web Development", category: "Development", description: "Custom websites and web applications", price: 35000, currency: "USD", status: "active", views: 1245, inquiries: 42, createdAt: "2024-01-15" },
  { id: "2", name: "API Development", category: "Development", description: "RESTful APIs and backend services", price: 25000, currency: "USD", status: "active", views: 890, inquiries: 28, createdAt: "2024-02-20" },
  { id: "3", name: "Database Design", category: "Database", description: "Database architecture & optimization", price: 15000, currency: "USD", status: "active", views: 567, inquiries: 15, createdAt: "2024-03-10" },
  { id: "4", name: "Mobile App Development", category: "Mobile", description: "iOS and Android applications", price: 50000, currency: "USD", status: "inactive", views: 423, inquiries: 12, createdAt: "2024-01-05" },
  { id: "5", name: "Website Maintenance", category: "Maintenance", description: "Website updates and bug fixes", price: 5000, currency: "USD", status: "active", views: 2341, inquiries: 89, createdAt: "2024-04-01" },
];

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

  const data = services || defaultServices;

  const filteredServices = data
    .filter(s => 
      (statusFilter === "all" || s.status === statusFilter) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       s.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "views") return b.views - a.views;
      return a.name.localeCompare(b.name);
    });

  const stats = {
    total: data.length,
    active: data.filter(s => s.status === "active").length,
    inactive: data.filter(s => s.status === "inactive").length,
    totalViews: data.reduce((acc, s) => acc + s.views, 0),
    totalInquiries: data.reduce((acc, s) => acc + s.inquiries, 0),
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
                  {filteredServices.map((service) => (
                    <TableRow key={service.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{service.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{service.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{service.category}</TableCell>
                      <TableCell>${service.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            service.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{service.views.toLocaleString()}</TableCell>
                      <TableCell>{service.inquiries}</TableCell>
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

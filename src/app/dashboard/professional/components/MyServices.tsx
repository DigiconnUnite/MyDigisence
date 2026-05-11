"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  status: "active" | "inactive";
  icon?: React.ReactNode;
}

interface MyServicesProps {
  services?: Service[];
  isLoading?: boolean;
  onViewAll?: () => void;
  onAddService?: () => void;
}

const defaultServices: Service[] = [
  {
    id: "1",
    name: "Web Development",
    category: "Development",
    price: 35000,
    currency: "USD",
    status: "active",
  },
  {
    id: "2",
    name: "API Development",
    category: "Development",
    price: 10000,
    currency: "USD",
    status: "active",
  },
  {
    id: "3",
    name: "Database Design",
    category: "Database",
    price: 8000,
    currency: "USD",
    status: "active",
  },
  {
    id: "4",
    name: "Website Maintenance",
    category: "Maintenance",
    price: 5000,
    currency: "USD",
    status: "active",
  },
];

const statusConfig = {
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600" },
};

export default function MyServices({
  services,
  isLoading = false,
  onViewAll,
  onAddService,
}: MyServicesProps) {
  const data = services || defaultServices;

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-4 h-10 bg-gray-200 rounded-lg" />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Services you offer to clients
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {data.map((service) => {
          const status = statusConfig[service.status];

          return (
            <div
              key={service.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {service.name}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {service.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  ${service.price.toLocaleString()}
                </span>
                <Badge
                  className={cn(
                    "text-xs font-medium px-2 py-0.5",
                    status.className
                  )}
                >
                  {status.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full mt-4 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
        onClick={onAddService}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Service
      </Button>
    </Card>
  );
}

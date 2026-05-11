"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Enquiry {
  id: string;
  name: string;
  avatar?: string;
  description: string;
  time: string;
  status: "new" | "contacted" | "replied";
}

interface RecentEnquiriesProps {
  enquiries?: Enquiry[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

const defaultEnquiries: Enquiry[] = [
  {
    id: "1",
    name: "Vikram Mahto",
    description: "Interested in Web Development project",
    time: "2 mins ago",
    status: "new",
  },
  {
    id: "2",
    name: "Pooja Patel",
    description: "Looking for social media marketing",
    time: "15 mins ago",
    status: "new",
  },
  {
    id: "3",
    name: "Amit Kumar",
    description: "Wants to collaborate on a project",
    time: "1 hour ago",
    status: "contacted",
  },
  {
    id: "4",
    name: "Sunil Yadav",
    description: "Interested in SEO services",
    time: "2 hours ago",
    status: "contacted",
  },
  {
    id: "5",
    name: "Ritika Singh",
    description: "Content marketing inquiry",
    time: "2 hours ago",
    status: "replied",
  },
];

const statusConfig = {
  new: { label: "New", variant: "default" as const, className: "bg-green-100 text-green-700 hover:bg-green-100" },
  contacted: { label: "Contacted", variant: "secondary" as const, className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  replied: { label: "Replied", variant: "outline" as const, className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
};

export default function RecentEnquiries({
  enquiries,
  isLoading = false,
  onViewAll,
}: RecentEnquiriesProps) {
  const data = enquiries || defaultEnquiries;

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-48 bg-gray-200 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Enquiries</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Latest inquiries from potential clients
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

      <div className="space-y-4">
        {data.map((enquiry) => {
          const status = statusConfig[enquiry.status];
          const initials = enquiry.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={enquiry.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Avatar className="h-10 w-10">
                {enquiry.avatar ? (
                  <Image
                    src={enquiry.avatar}
                    alt={enquiry.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {enquiry.name}
                  </h4>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {enquiry.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {enquiry.description}
                </p>
              </div>

              <Badge
                variant={status.variant}
                className={cn(
                  "text-xs font-medium px-2 py-0.5 whitespace-nowrap",
                  status.className
                )}
              >
                {status.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

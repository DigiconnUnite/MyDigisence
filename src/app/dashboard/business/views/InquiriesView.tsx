"use client";

import React from "react";
import { Mail, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessInquiriesSection } from "../components/BusinessInquiriesSection";
import type { Inquiry } from "../types";

interface InquiriesViewProps {
  inquiries: Inquiry[];
  stats: any;
  searchTerm: string;
  updatingInquiry: string | null;
  onSearchTermChange: (term: string) => void;
  onInquiryStatusUpdate: (inquiryId: string, newStatus: string) => Promise<void>;
  formatDate: (dateString: string) => string;
}

export default function InquiriesView({
  inquiries,
  stats,
  searchTerm,
  updatingInquiry,
  onSearchTermChange,
  onInquiryStatusUpdate,
  formatDate,
}: InquiriesViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Inquiries Management
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Manage and respond to customer inquiries.
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Inquiries Section */}
      <BusinessInquiriesSection
        inquiries={inquiries}
        stats={stats}
        formatDate={formatDate}
        onStatusUpdate={onInquiryStatusUpdate}
      />
    </div>
  );
}

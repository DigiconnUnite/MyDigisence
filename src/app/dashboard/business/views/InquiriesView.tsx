"use client";

import React from "react";
import { Mail } from "lucide-react";
import { BusinessInquiriesSection } from "../components/BusinessInquiriesSection";
import type { Inquiry } from "../types";
import AdminSectionHeader from "../../admin/components/AdminSectionHeader";
import AdminViewControls from "../../admin/components/AdminViewControls";

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
      <AdminSectionHeader
        title="Inquiries Management"
        description="Manage and respond to customer inquiries."
      />

      <AdminViewControls
        searchValue={searchTerm}
        onSearchChange={onSearchTermChange}
        searchPlaceholder="Search inquiries..."
      />

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

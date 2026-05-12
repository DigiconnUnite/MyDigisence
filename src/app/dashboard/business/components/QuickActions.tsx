"use client";

import React from "react";
import { memo } from "react";
import { Plus, Settings, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActionCard from "./ActionCard";

interface QuickActionsProps {
  onNavigateToProducts: () => void;
  onNavigateToInfo: () => void;
  onNavigateToInquiries: () => void;
  onOpenCatalogPreview: () => void;
  hasBusinessSlug: boolean;
}

export default memo(function QuickActions({
  onNavigateToProducts,
  onNavigateToInfo,
  onNavigateToInquiries,
  onOpenCatalogPreview,
  hasBusinessSlug,
}: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <ActionCard
        title="Add New Product"
        description="Add a new product to your catalog"
        icon={<Plus className="h-5 w-5" />}
        buttonText="Add Product"
        buttonAction={onNavigateToProducts}
      />
      <ActionCard
        title="View Catalog"
        description="Preview your public business catalog"
        icon={<ExternalLink className="h-5 w-5" />}
        buttonText="View Public Catalog"
        buttonAction={onOpenCatalogPreview}
        disabled={!hasBusinessSlug}
        variant="outline"
      />
      <ActionCard
        title="Update Business Profile"
        description="Edit your business information and settings"
        icon={<Settings className="h-5 w-5" />}
        buttonText="Edit Profile"
        buttonAction={onNavigateToInfo}
        variant="outline"
      />
      <ActionCard
        title="Check Inquiries"
        description="Review and respond to customer inquiries"
        icon={<Mail className="h-5 w-5" />}
        buttonText="View Inquiries"
        buttonAction={onNavigateToInquiries}
        variant="outline"
      />
    </div>
  );
});

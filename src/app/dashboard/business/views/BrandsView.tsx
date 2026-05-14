"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { BusinessBrandsSection } from "../components/BusinessBrandsSection";
import type { BrandContent } from "../types";
import AdminSectionHeader from "../../admin/components/AdminSectionHeader";

interface BrandsViewProps {
  sectionTitle: string;
  brandContent: BrandContent;
  savingBrand: boolean;
  onSectionTitleChange: (value: string) => void;
  onBrandNameChange: (value: string) => void;
  onBrandLogoChange: (value: string) => void;
  onBrandLogoUpload: (url: string) => void;
  onAddBrand: () => void;
  onEditBrand: (index: number) => void;
  onDeleteBrand: (index: number, name: string) => void;
}

export default function BrandsView({
  sectionTitle,
  brandContent,
  savingBrand,
  onSectionTitleChange,
  onBrandNameChange,
  onBrandLogoChange,
  onBrandLogoUpload,
  onAddBrand,
  onEditBrand,
  onDeleteBrand,
}: BrandsViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fadeIn">
      <AdminSectionHeader
        title="Brands Management"
        description="Manage your brand portfolio and partnerships."
      />

      {/* Brands Section */}
      <BusinessBrandsSection
        sectionTitle={sectionTitle}
        brandContent={brandContent}
        savingBrand={savingBrand}
        onSectionTitleChange={onSectionTitleChange}
        onBrandNameChange={onBrandNameChange}
        onBrandLogoChange={onBrandLogoChange}
        onBrandLogoUpload={onBrandLogoUpload}
        onAddBrand={onAddBrand}
        onEditBrand={onEditBrand}
        onDeleteBrand={onDeleteBrand}
      />
    </div>
  );
}

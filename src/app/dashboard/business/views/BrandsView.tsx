"use client";

import React from "react";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessBrandsSection } from "../components/BusinessBrandsSection";
import type { BrandContent } from "../types";

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
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Brands Management
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Manage your brand portfolio and partnerships.
        </p>
      </div>

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

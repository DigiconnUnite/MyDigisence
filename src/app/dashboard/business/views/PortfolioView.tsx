"use client";

import React from "react";
import { Image as ImageIcon, Plus } from "lucide-react";
import { BusinessPortfolioSection } from "../components/BusinessPortfolioSection";
import type { PortfolioContent, PortfolioItem } from "../types";
import AdminSectionHeader from "../../admin/components/AdminSectionHeader";

interface PortfolioViewProps {
  portfolioContent: PortfolioContent;
  savingPortfolio: boolean;
  onPortfolioContentChange: (content: PortfolioContent) => void;
  onSavePortfolio: (images: PortfolioItem[]) => Promise<void>;
}

export default function PortfolioView({
  portfolioContent,
  savingPortfolio,
  onPortfolioContentChange,
  onSavePortfolio,
}: PortfolioViewProps) {
  const images = portfolioContent?.images ?? [];

  const handleSaveImages = async (nextImages: PortfolioItem[]) => {
    onPortfolioContentChange({ ...portfolioContent, images: nextImages });
    await onSavePortfolio(nextImages);
  };

  const handleDeleteImageRequest = async (index: number) => {
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);
    await handleSaveImages(nextImages);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fadeIn">
      <AdminSectionHeader
        title="Portfolio Management"
        description="Manage your business portfolio and showcase your work."
      />

      {/* Portfolio Section */}
      <BusinessPortfolioSection
        images={images}
        onSaveImages={handleSaveImages}
        onDeleteImageRequest={handleDeleteImageRequest}
      />
    </div>
  );
}

"use client";

import React from "react";
import { Image as ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessPortfolioSection } from "../components/BusinessPortfolioSection";
import type { PortfolioContent } from "../types";

interface PortfolioViewProps {
  portfolioContent: PortfolioContent;
  savingPortfolio: boolean;
  onPortfolioContentChange: (content: PortfolioContent) => void;
  onSavePortfolio: () => Promise<void>;
}

export default function PortfolioView({
  portfolioContent,
  savingPortfolio,
  onPortfolioContentChange,
  onSavePortfolio,
}: PortfolioViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Portfolio Management
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Manage your business portfolio and showcase your work.
        </p>
      </div>

      {/* Portfolio Section */}
      <BusinessPortfolioSection
        portfolioContent={portfolioContent}
        savingPortfolio={savingPortfolio}
        onPortfolioContentChange={onPortfolioContentChange}
        onSavePortfolio={onSavePortfolio}
      />
    </div>
  );
}

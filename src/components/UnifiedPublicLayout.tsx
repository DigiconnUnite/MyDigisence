"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import PublicPageHeader from "./PublicPageHeader";
import PublicPageSidebar from "./PublicPageSidebar";
import Footer from "./Footer";
import { Users, Building2, Calculator, Mail, Home, ShoppingBag, Code, Stethoscope, Scale, Hammer, GraduationCap, Palette, TrendingUp, Briefcase, Camera, ChefHat, Pill, Heart, GraduationCap as Education, Building, Coffee, ShoppingCart, Truck, Cog, Plane } from "lucide-react";

// Default navigation items
const defaultNavItems = [
  { name: "Home", link: "/", icon: Home },
  { name: "Marketplace", link: "/marketplace", icon: ShoppingBag },
  { name: "Businesses", link: "/businesses", icon: Building2 },
  { name: "Professionals", link: "/professionals", icon: Users },
  { name: "Pricing", link: "/pricing", icon: Calculator },
  { name: "Contact Us", link: "/contact", icon: Mail },
];

// Marketplace categories - combined for both businesses and professionals
const marketplaceCategories = [
  { name: "IT Services", icon: Code },
  { name: "Digital Marketing", icon: TrendingUp },
  { name: "Education", icon: Education },
  { name: "Healthcare", icon: Heart },
  { name: "Real Estate", icon: Building },
  { name: "Restaurant", icon: ChefHat },
  { name: "Automotive", icon: Truck },
  { name: "Consulting", icon: Briefcase },
  { name: "Travel & Tourism", icon: Plane },
  { name: "Beauty & Wellness", icon: Heart },
  { name: "Shop", icon: ShoppingCart },
  { name: "Hotel", icon: Building },
  { name: "Cafe", icon: Coffee },
  { name: "Retail", icon: ShoppingBag },
  { name: "Manufacturing", icon: Cog },
  { name: "Developer", icon: Code },
  { name: "Doctor", icon: Stethoscope },
  { name: "Lawyer", icon: Scale },
  { name: "Engineer", icon: Hammer },
  { name: "Teacher", icon: GraduationCap },
  { name: "Designer", icon: Palette },
  { name: "Photographer", icon: Camera },
  { name: "Accountant", icon: Calculator },
];

// Default categories for professionals
const defaultProfessions = [
  { name: "Developer", icon: Users },
  { name: "Doctor", icon: Users },
  { name: "Lawyer", icon: Users },
  { name: "Engineer", icon: Users },
  { name: "Teacher", icon: Users },
  { name: "Accountant", icon: Users },
  { name: "Designer", icon: Users },
  { name: "Marketer", icon: Users },
  { name: "Consultant", icon: Users },
  { name: "Photographer", icon: Users },
  { name: "Chef", icon: Users },
  { name: "Manager", icon: Users },
  { name: "Architect", icon: Users },
  { name: "Nurse", icon: Users },
  { name: "Pharmacist", icon: Users },
];

// Default categories for businesses
const defaultBusinessCategories = [
  { name: "IT Services", icon: Building2 },
  { name: "Restaurant", icon: Building2 },
  { name: "Digital Marketing", icon: Building2 },
  { name: "Travel Agency", icon: Building2 },
  { name: "Shop", icon: Building2 },
  { name: "Hotel", icon: Building2 },
  { name: "Cafe", icon: Building2 },
  { name: "Retail", icon: Building2 },
  { name: "Healthcare", icon: Building2 },
  { name: "Education", icon: Building2 },
];

// Pricing categories
const pricingCategories = [
  { name: "Free Plan", icon: Calculator },
  { name: "Pro Plan", icon: Calculator },
  { name: "Business Plan", icon: Calculator },
  { name: "Enterprise", icon: Calculator },
];

// Home page categories
const homeCategories = [
  { name: "Business Solutions", icon: Building2 },
  { name: "Professional Services", icon: Users },
  { name: "Pricing Plans", icon: Calculator },
  { name: "Contact Support", icon: Mail },
];

export interface UnifiedPublicLayoutProps {
  children: React.ReactNode;
  variant?: "transparent" | "solid";
  sidebarVariant?: "home" | "professionals" | "businesses" | "pricing" | "contact" | "marketplace";
  showCategorySlider?: boolean;
  categories?: { name: string; icon: React.ComponentType<{ className?: string }> }[];
  pageSlug?: string; // Optional - used for auto-detecting variant
  customNavItems?: {
    name: string;
    link: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  selectedCategory?: string | null;
  onCategorySelect?: (category: string | null) => void;
}

// Auto-detect variant and sidebar variant based on page slug
const detectVariants = (pageSlug?: string): { variant: "transparent" | "solid"; sidebarVariant: "home" | "professionals" | "businesses" | "pricing" | "contact" | "marketplace" } => {
  if (!pageSlug || pageSlug === "/") {
    return { variant: "transparent", sidebarVariant: "home" };
  }

  const normalizedSlug = pageSlug.toLowerCase();

  if (normalizedSlug.startsWith("/marketplace")) {
    return { variant: "solid", sidebarVariant: "marketplace" };
  }
  if (normalizedSlug.startsWith("/professionals")) {
    return { variant: "solid", sidebarVariant: "professionals" };
  }
  if (normalizedSlug.startsWith("/businesses")) {
    return { variant: "solid", sidebarVariant: "businesses" };
  }
  if (normalizedSlug.startsWith("/pricing")) {
    return { variant: "solid", sidebarVariant: "pricing" };
  }

  // Default for unknown pages (including contact)
  return { variant: "solid", sidebarVariant: "home" };
};

// Get default categories based on sidebar variant
const getDefaultCategories = (sidebarVariant: string) => {
  switch (sidebarVariant) {
    case "marketplace":
      return marketplaceCategories;
    case "professionals":
      return defaultProfessions;
    case "businesses":
      return defaultBusinessCategories;
    case "pricing":
      return pricingCategories;
    default:
      return homeCategories;
  }
};

export default function UnifiedPublicLayout({
  children,
  variant: propVariant,
  sidebarVariant: propSidebarVariant,
  showCategorySlider = false,
  categories: propCategories,
  pageSlug,
  customNavItems,
  selectedCategory: propSelectedCategory,
  onCategorySelect: propOnCategorySelect,
}: UnifiedPublicLayoutProps) {
  // Auto-detect variants if not provided
  const { variant: detectedVariant, sidebarVariant: detectedSidebarVariant } = detectVariants(pageSlug);
  const variant = propVariant ?? detectedVariant;
  const sidebarVariant = propSidebarVariant ?? detectedSidebarVariant;

  // Get categories - use provided or default based on sidebar variant
  const categories = propCategories ?? getDefaultCategories(sidebarVariant);

  // Internal state management - use props if provided, otherwise use internal state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [internalSelectedCategory, setInternalSelectedCategory] = useState<string | null>(null);
  
  // Use external state if provided, otherwise use internal state
  const selectedCategory = propSelectedCategory !== undefined ? propSelectedCategory : internalSelectedCategory;
  const onCategorySelect = propOnCategorySelect ?? setInternalSelectedCategory;

  // Handlers
  const handleSidebarOpen = () => setSidebarOpen(true);
  const handleSidebarClose = () => setSidebarOpen(false);
  const handleCategorySelect = (category: string | null) => {
    onCategorySelect(category === selectedCategory ? null : category);
  };

  return (
    <div className="min-h-screen white">
      {/* Sidebar */}
      <PublicPageSidebar
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        variant={sidebarVariant}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={handleSidebarClose}
        />
      )}

      {/* Header */}
      <PublicPageHeader
        variant={variant}
        showSidebarToggle={true}
        showCategorySlider={showCategorySlider}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onSidebarOpen={handleSidebarOpen}
        sidebarOpen={sidebarOpen}
        customNavItems={customNavItems}
      />

      {/* Main Content */}
      <main className={cn(
        variant === "transparent" ? "" : "pt-14 md:pt-22"
      )}>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Re-export for convenience
export { default as PublicPageHeader } from "./PublicPageHeader";
export { default as PublicPageSidebar } from "./PublicPageSidebar";

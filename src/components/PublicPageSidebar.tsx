"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu, Home, Building2, Users, Calculator, Mail, Filter, Code, Stethoscope, Scale, Hammer, Book, Palette, Megaphone, Briefcase, Camera, ChefHat, Pill, GraduationCap, TrendingUp, Laptop, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Default navigation items for all pages
const defaultNavItems = [
  { name: "Home", link: "/", icon: Home },
  { name: "Businesses", link: "/businesses", icon: Building2 },
  { name: "Professionals", link: "/professionals", icon: Users },
  { name: "Blog", link: "/blog", icon: BookOpen },
  { name: "Pricing", link: "/pricing", icon: Calculator },
  { name: "Contact Us", link: "/contact", icon: Mail },
];

// Home page categories
const homeCategories = [
  { name: "Business Solutions", icon: Building2 },
  { name: "Professional Services", icon: Users },
  { name: "Pricing Plans", icon: Calculator },
  { name: "Contact Support", icon: Mail },
];

// Professional categories
const professionalCategories = [
  { name: "Developer", icon: Code },
  { name: "Doctor", icon: Stethoscope },
  { name: "Lawyer", icon: Scale },
  { name: "Engineer", icon: Hammer },
  { name: "Teacher", icon: GraduationCap },
  { name: "Accountant", icon: Calculator },
  { name: "Designer", icon: Palette },
  { name: "Marketer", icon: TrendingUp },
  { name: "Consultant", icon: Briefcase },
  { name: "Photographer", icon: Camera },
];

// Business categories
const businessCategories = [
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

export interface PublicPageSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: "home" | "professionals" | "businesses" | "pricing" | "contact";
  categories?: { name: string; icon: React.ComponentType<{ className?: string }> }[];
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string | null;
}

export default function PublicPageSidebar({
  isOpen,
  onClose,
  variant = "home",
  categories,
  onCategorySelect,
  selectedCategory,
}: PublicPageSidebarProps) {
  const pathname = usePathname();

  // Get categories based on variant or use provided ones
  const getCategories = () => {
    if (categories && categories.length > 0) {
      return categories;
    }
    switch (variant) {
      case "professionals":
        return professionalCategories;
      case "businesses":
        return businessCategories;
      case "pricing":
        return pricingCategories;
      default:
        return homeCategories;
    }
  };

  // Get section title based on variant
  const getSectionTitle = () => {
    switch (variant) {
      case "professionals":
      case "businesses":
        return "Categories";
      case "pricing":
        return "Pricing Plans";
      default:
        return "Quick Links";
    }
  };

  // Get active link styling based on variant
  const getActiveLinkClass = (isActive: boolean) => {
    if (variant === "home") {
      return isActive
        ? "bg-slate-800 text-white"
        : "text-gray-700 hover:bg-gray-100";
    }
    return isActive
      ? "bg-slate-800 text-white"
      : "text-gray-700 hover:bg-gray-100";
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const currentCategories = getCategories();
  const sectionTitle = getSectionTitle();

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo-header.png" alt="DigiSence" className="h-7 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {defaultNavItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                    getActiveLinkClass(isActive)
                  )}
                >
                  <IconComponent className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Categories Section */}
            {currentCategories.length > 0 && (
              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex items-center px-3 mb-3">
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {sectionTitle}
                  </span>
                </div>
                <div className="space-y-1">
                  {currentCategories.map((category) => {
                    const IconComponent = category.icon;
                    const isSelected = selectedCategory === category.name;
                    return (
                      <button
                        key={category.name}
                        onClick={() => {
                          if (onCategorySelect) {
                            onCategorySelect(
                              isSelected ? null! : category.name
                            );
                          }
                          onClose(); // Close sidebar after selection
                        }}
                        className={cn(
                          "w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200",
                          isSelected
                            ? "bg-slate-800 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        <IconComponent className="mr-3 h-4 w-4" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              variant="outline"
              className="w-full text-white bg-slate-800 border-gray-800 hover:bg-slate-700 transition-colors duration-200"
              asChild
            >
              <Link href="/register" onClick={onClose}>
                Make Your Profile
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white text-gray-900 hover:bg-slate-800 hover:text-white border-gray-800 transition-colors duration-200"
              asChild
            >
              <Link href="/login" onClick={onClose}>
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
    </>
  );
}

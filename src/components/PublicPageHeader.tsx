"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Home,
  Building2,
  Users,
  Calculator,
  Mail,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  Code,
  Stethoscope,
  Scale,
  Hammer,
  GraduationCap,
  Palette,
  TrendingUp,
  Briefcase,
  Camera,
  ChefHat,
  Pill,
} from "lucide-react";

export interface PublicPageHeaderProps {
  variant?: "transparent" | "solid";
  showSidebarToggle?: boolean;
  showCategorySlider?: boolean;
  categories?: {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  onCategorySelect?: (category: string | null) => void;
  selectedCategory?: string | null;
  onSidebarOpen?: () => void;
  sidebarOpen?: boolean;
  customNavItems?: {
    name: string;
    link: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

// Default navigation items
const defaultNavItems = [
  { name: "Home", link: "/", icon: Home },
  { name: "Businesses", link: "/businesses", icon: Building2 },
  { name: "Professionals", link: "/professionals", icon: Users },
  { name: "Pricing", link: "/pricing", icon: Calculator },
  { name: "Contact Us", link: "/contact", icon: Mail },
];

// Default categories for professionals
const defaultProfessions = [
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
  { name: "Chef", icon: ChefHat },
  { name: "Manager", icon: Users },
  { name: "Architect", icon: Building2 },
  { name: "Nurse", icon: Stethoscope },
  { name: "Pharmacist", icon: Pill },
];

export default function PublicPageHeader({
  variant = "solid",
  showSidebarToggle = true,
  showCategorySlider = false,
  categories = defaultProfessions,
  onCategorySelect,
  selectedCategory = null,
  onSidebarOpen,
  sidebarOpen = false,
  customNavItems,
}: PublicPageHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const navItems = customNavItems || defaultNavItems;

  // Handle scroll state for transparent variant
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    if (variant === "transparent") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

  // Scroll categories left or right
  const scrollCategories = useCallback((direction: "left" | "right") => {
    if (categoryScrollRef.current) {
      const scrollAmount = 200;
      const currentScroll = categoryScrollRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      categoryScrollRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  }, []);

  // Determine if header should be transparent
  const isTransparent = variant === "transparent" && !scrolled;

  // Handle category selection
  const handleCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(
        selectedCategory === categoryName ? null : categoryName
      );
    }
  };

  return (
    <>
      {/* Navigation Bar - Fixed at Top */}
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-30",
          isTransparent
            ? "bg-transparent"
            : "bg-white border-b border-gray-200 shadow-sm",
        )}
      >
        <div className="mx-auto container px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center relative h-14 md:h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img
                  src="/logo-header.png"
                  alt="DigiSence Logo"
                  className={cn(
                    "h-8 w-auto transition-transform duration-300 group-hover:scale-110",
                    isTransparent ? "filter invert hue-rotate-180    " : ""
                  )}
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-4 lg:space-x-8 flex-1 justify-center">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.link}
                    className={cn(
                      "hover:text-slate-600  leading-tight tracking-tighter transition-all duration-200 px-2 py-1 rounded-md text-sm lg:text-base flex items-center space-x-1",
                      pathname === item.link
                        ? isTransparent
                          ? "bg-white/20 text-white font-bold"
                          : "bg-white text-slate-800 font-bold"
                        : isTransparent
                          ? "text-white"
                          : "text-gray-700",
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden md:flex space-x-2 sm:space-x-4">
                <Button
                  variant="outline"
                  className={cn(
                    "text-white border-gray-800 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4",
                    isTransparent
                      ? "bg-slate-900/20 border-white/50 hover:bg-white/30"
                      : "bg-slate-800 hover:bg-slate-700",
                  )}
                  asChild
                >
                  <Link href="/register">Make Your Profile</Link>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-white text-gray-900 hover:bg-slate-800 hover:text-white border-gray-800 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4",
                    isTransparent &&
                      "border-white/50 hover:bg-white hover:text-slate-800",
                  )}
                  asChild
                >
                  <Link href="/login">Login</Link>
                </Button>
              </div>

              {/* Mobile Sidebar Toggle */}
              {showSidebarToggle && (
                <button
                  onClick={onSidebarOpen}
                  className={cn(
                    "p-2 rounded-md hover:bg-gray-100 md:hidden",
                    isTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-gray-700",
                  )}
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Slider - Only visible when showCategorySlider is true */}
        {showCategorySlider && (
          <div className="hidden md:block bg-slate-50 border-t border-gray-200">
            <div className="mx-auto">
              <div className="relative">
                {/* Scroll Left Button */}
                <button
                  onClick={() => scrollCategories("left")}
                  className="absolute left-0 top-0 bottom-0 z-10 bg-gray-50 hover:bg-white flex items-center justify-center pr-1 border-r transition-all duration-200"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>

                {/* Scroll Right Button */}
                <button
                  onClick={() => scrollCategories("right")}
                  className="absolute right-0 top-0 bottom-0 z-10 bg-gray-50 hover:bg-white flex items-center justify-center pl-1 border-l transition-all duration-200"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>

                {/* Category Scroll Container */}
                <div
                  ref={categoryScrollRef}
                  className="flex items-center overflow-x-auto scrollbar-hide px-8"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.name}
                        onClick={() => handleCategoryClick(category.name)}
                        className={cn(
                          "px-3 py-1 text-xs sm:text-sm font-semibold hover:bg-slate-800 hover:text-white whitespace-nowrap cursor-pointer transition-all duration-200 shrink-0 border-r border-gray-300 last:border-r-0 flex items-center space-x-1 sm:space-x-2",
                          selectedCategory === category.name
                            ? "bg-slate-800 text-white"
                            : "text-gray-500",
                        )}
                      >
                        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">
                          {category.name}
                        </span>
                        <span className="sm:hidden">
                          {category.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay - Visible on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onSidebarOpen}
        />
      )}
    </>
  );
}

"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSocket } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import {
  getOptimizedImageUrl,
  generateSrcSet,
  generateSizes,
} from "@/lib/image-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  Send,
  X,
  Image,
  Menu,
  Tag,
  Search,
  Fullscreen,
  ImageOff,
  Home,
  ShoppingBag,
  Grid3X3,
  MessageSquare,
  User,
  Briefcase,
  UserPlus,
  Share2,
  Download,
  Building2,
  Settings,
  LogOut,
  ChevronLeft,
  Grid2X2Check,
} from "lucide-react";
import { FaWhatsapp, FaWhatsappSquare } from "react-icons/fa";
import {
  SiFacebook,
  SiX,
  SiInstagram,
  SiLinkedin,
  SiWhatsapp,
} from "react-icons/si";
import { LampContainer } from "./ui/lamp";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Footer from "@/components/Footer";

// Define Business type since Prisma doesn't export it for MongoDB
interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  about: string | null;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  catalogPdf: string | null;
  openingHours: any;
  gstNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminId: string;
  categoryId: string | null;
  heroContent: any;
  brandContent: any;
  portfolioContent: any;
}

// Define custom Product type to match the updated schema
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  image: string | null;
  inStock: boolean;
  isActive: boolean;
  additionalInfo: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
  categoryId: string | null;
  brandName: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

interface BusinessProfileProps {
  business: Business & {
    admin: { name?: string | null; email: string };
    category?: { name: string } | null;
    portfolioContent?: any;
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    about?: string | null;
    catalogPdf?: string | null;
    openingHours?: any[];
    gstNumber?: string | null;
    products: (Product & {
      category?: { id: string; name: string } | null;
    })[];
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    _count?: {
      products: number;
    };
  }>;
}

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  productId?: string;
}

export default function BusinessProfile({
  business: initialBusiness,
  categories: initialCategories = [],
}: BusinessProfileProps) {
  const searchParams = useSearchParams();
  const [business, setBusiness] = useState(initialBusiness);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productModal, setProductModal] = useState(false);
  const [selectedProductModal, setSelectedProductModal] =
    useState<Product | null>(null);
  const [inquiryData, setInquiryData] = useState<InquiryFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [viewAllBrands, setViewAllBrands] = useState(false);
  const [viewAllProducts, setViewAllProducts] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lastUpdateCheck, setLastUpdateCheck] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Socket.io connection
  const { socket, isConnected } = useSocket(business.id);

  // Refs for smooth scrolling
  const aboutRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Data is already loaded via SSR, remove artificial delay
    setIsLoading(false);
    return () => {};
  }, []);

  // Listen for Real-time Updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (payload: any) => {
      console.log("Received update:", payload);

      if (payload.type === "BUSINESS_UPDATE") {
        setBusiness(payload.data);
        setLastUpdateCheck(Date.now());
        console.log("Business data updated from server");
      } else if (payload.type === "PRODUCT_UPDATE") {
        setBusiness((prev: any) => ({
          ...prev,
          products: prev.products.map((p: any) =>
            p.id === payload.data.id ? payload.data : p,
          ),
        }));
        console.log("Product data updated from server");
      }
    };

    socket.on("data-updated", handleUpdate);

    return () => {
      socket.off("data-updated", handleUpdate);
    };
  }, [socket]);

  const forceRefresh = async () => {
    setIsRefreshing(true);
    // Manual refresh by fetching current data
    try {
      const response = await fetch(
        `/api/businesses?${business.slug ? `slug=${business.slug}` : `id=${business.id}`}`,
        {
          cache: "no-store",
        },
      );
      if (response.ok) {
        const data = await response.json();
        setBusiness(data.business);
        setLastUpdateCheck(Date.now());
      }
    } catch (error) {
      console.warn("Failed to force refresh:", error);
    }
    setIsRefreshing(false);
  };

  // Check URL parameters for auto-opening product modal
  useEffect(() => {
    if (!mounted || !business.products) return;

    const productId = searchParams.get("product");
    const modal = searchParams.get("modal");

    if (productId && modal === "open") {
      const product = business.products.find((p) => p.id === productId);
      if (product) {
        setSelectedProductModal(product);
        setProductModal(true);
        // Clear the URL parameters after opening modal
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.delete("product");
          url.searchParams.delete("modal");
          window.history.replaceState({}, "", url.toString());
        }
      } else {
        console.warn("Product not found for ID:", productId);
        // Optionally show an alert for invalid product
        if (typeof window !== "undefined") {
          alert("The requested product could not be found.");
        }
      }
    }
  }, [mounted, business.products, searchParams]);

  // Default hero content if not set
  const heroContent = (business.heroContent as any) || {
    slides: [
      {
        mediaType: "image",
        media: "",
        headline: "Welcome to " + business.name,
        headlineSize: "text-4xl md:text-6xl",
        headlineColor: "#ffffff",
        headlineAlignment: "center",
        subheadline:
          business.description || "Discover our amazing products and services",
        subtextSize: "text-xl md:text-2xl",
        subtextColor: "#ffffff",
        subtextAlignment: "center",
        cta: "Get in Touch",
        ctaLink: "",
      },
    ],
    autoPlay: true,
    transitionSpeed: 5,
  };
  // Ensure heroContent.slides is always an array (defensive check)
  const safeSlides = Array.isArray(heroContent.slides) ? heroContent.slides : [];

  // Autoplay functionality for hero carousel
  useEffect(() => {
    if (
      heroContent.slides &&
      heroContent.slides.length > 1 &&
      heroContent.autoPlay
    ) {
      const interval = setInterval(
        () => {
          setCurrentSlideIndex(
            (prev) => (prev + 1) % heroContent.slides.length,
          );
        },
        (heroContent.transitionSpeed || 5) * 1000,
      );
      return () => clearInterval(interval);
    }
  }, [heroContent.slides, heroContent.autoPlay, heroContent.transitionSpeed]);

  // Reset slide index when slides change
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [heroContent.slides?.length]);

  // Default brand content if not set
  const brandContent = (business.brandContent as any) || { brands: [] };
  // Ensure brandContent.brands is always an array (defensive check)
  const safeBrands = Array.isArray(brandContent.brands) ? brandContent.brands : [];

  // Default category content if not set
  const categoryContent = business.category
    ? {
        categories: [business.category],
      }
    : {
        categories: [],
      };

  // Default portfolio content if not set
  const portfolioContent = (business.portfolioContent as any) || { images: [] };
  // Ensure portfolioContent.images is always an array (defensive check)
  const safePortfolioImages = Array.isArray(portfolioContent.images) ? portfolioContent.images : [];

  // Categories and filtered products for search/filter - memoized for performance
  const { categories, filteredProducts } = useMemo(() => {
    console.log("DEBUG: initialCategories received:", initialCategories);
    const categories = initialCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));
    console.log("DEBUG: categories for dropdown:", categories);
    const filteredProducts = business.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category?.id === selectedCategory;
      const matchesBrand =
        selectedBrand === null || product.brandName === selectedBrand;
      return matchesSearch && matchesCategory && matchesBrand;
    });
    return { categories, filteredProducts };
  }, [
    initialCategories,
    business.products,
    searchTerm,
    selectedCategory,
    selectedBrand,
  ]);

  // Related products for modal - memoized for performance
  const relatedProducts = useMemo(() => {
    if (!selectedProductModal) return [];

    const mainProduct = selectedProductModal;
    const allProducts = business.products.filter(
      (p) => p.id !== mainProduct.id && p.isActive,
    );

    // Keywords that indicate a product is a component/spare part
    const componentKeywords = [
      "spare",
      "part",
      "component",
      "accessory",
      "kit",
      "module",
      "unit",
      "assembly",
      "replacement",
    ];

    // Score products based on relevance
    const scoredProducts = allProducts.map((product) => {
      let score = 0;

      // Higher score for products in same category
      if (product.category?.id === mainProduct.category?.id) {
        score += 3;
      }

      // Higher score for products with same brand
      if (product.brandName === mainProduct.brandName) {
        score += 2;
      }

      // Very high score if product name contains main product name (suggests it's a component)
      const mainProductWords = mainProduct.name.toLowerCase().split(" ");
      const productWords = product.name.toLowerCase().split(" ");

      for (const mainWord of mainProductWords) {
        if (
          mainWord.length > 3 &&
          product.name.toLowerCase().includes(mainWord)
        ) {
          score += 5;
          break;
        }
      }

      // High score for component keywords in product name or description
      const productText = (
        product.name +
        " " +
        (product.description || "")
      ).toLowerCase();
      for (const keyword of componentKeywords) {
        if (productText.includes(keyword)) {
          score += 4;
          break;
        }
      }

      // Medium score for products that share significant words with main product
      const commonWords = mainProductWords.filter(
        (word) => word.length > 3 && productWords.includes(word),
      );
      score += commonWords.length * 2;

      return { product, score };
    });

    // Sort by score (highest first) and return top 4
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .slice(0, 3)
      .map((item) => item.product);
  }, [business.products, selectedProductModal]);

  const handleInquiry = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        // Comprehensive validation
        const errors: string[] = [];

        // Name validation
        if (!inquiryData.name.trim()) {
          errors.push("Name is required");
        } else if (inquiryData.name.trim().length < 2) {
          errors.push("Name must be at least 2 characters long");
        } else if (inquiryData.name.trim().length > 100) {
          errors.push("Name must be less than 100 characters");
        }

        // Email validation
        if (!inquiryData.email.trim()) {
          errors.push("Email is required");
        } else {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(inquiryData.email.trim())) {
            errors.push("Please enter a valid email address");
          }
        }

        // Phone validation (optional but if provided, validate format)
        if (inquiryData.phone.trim()) {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(inquiryData.phone.replace(/[\s\-\(\)]/g, ""))) {
            errors.push("Please enter a valid phone number");
          }
        }

        // Message validation
        if (!inquiryData.message.trim()) {
          errors.push("Message is required");
        } else if (inquiryData.message.trim().length < 10) {
          errors.push("Message must be at least 10 characters long");
        } else if (inquiryData.message.trim().length > 2000) {
          errors.push("Message must be less than 2000 characters");
        }

        if (errors.length > 0) {
          alert(`Please fix the following errors:\n${errors.join("\n")}`);
          setIsSubmitting(false);
          return;
        }

        const response = await fetch("/api/inquiries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: inquiryData.name.trim(),
            email: inquiryData.email.trim().toLowerCase(),
            phone: inquiryData.phone.trim() || null,
            message: inquiryData.message.trim(),
            businessId: business.id,
            productId: selectedProduct?.id,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert(
            "Inquiry submitted successfully! We will get back to you soon.",
          );
          setInquiryModal(false);
          setInquiryData({ name: "", email: "", phone: "", message: "" });
          setSelectedProduct(null);
        } else {
          alert(
            `Failed to submit inquiry: ${result.error || "Please try again."}`,
          );
        }
      } catch (error) {
        console.error("Inquiry submission error:", error);
        alert(
          "An error occurred while submitting your inquiry. Please check your connection and try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [inquiryData, business.id, selectedProduct],
  );

  const handleShare = useCallback(
    (product: Product) => {
      const shareUrl = `${window.location.origin}/catalog/${business.slug}?product=${product.id}&modal=open`;
      const shareData = {
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: shareUrl,
      };
      if (navigator.share) {
        navigator.share(shareData).catch(console.error);
      } else {
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            alert("Link copied to clipboard!");
          })
          .catch(() => {
            alert("Failed to copy link");
          });
      }
    },
    [business.slug],
  );

  const openInquiryModal = (product?: Product) => {
    setSelectedProduct(product || null);
    setInquiryData((prev) => ({
      ...prev,
      message: product ? `I'm interested in ${product.name}` : "",
    }));
    setInquiryModal(true);
  };

  const openProductModal = (product: Product) => {
    setSelectedProductModal(product);
    setProductModal(true);
  };

  // Smooth scroll function - memoized for performance
  const scrollToSection = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, sectionName: string) => {
      setActiveSection(sectionName);
      if (ref.current) {
        const offset = 80; // Offset for the fixed header
        const container = mainContentRef.current;
        if (container) {
          const elementPosition = ref.current.offsetTop;
          const offsetPosition = elementPosition - offset;
          container.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } else if (sectionName === "home" && typeof window !== "undefined") {
        // Fallback for home section
        const container = mainContentRef.current;
        if (container) {
          container.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
      // Close mobile menu if open
      setMobileMenuOpen(false);
    },
    [],
  );

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.id;
            if (sectionName) {
              setActiveSection(sectionName);
            }
          }
        });
      },
      { threshold: 0.3 },
    );

    // Observe all sections
    const sections = [
      aboutRef.current,
      brandsRef.current,
      productsRef.current,
      portfolioRef.current,
      contactRef.current,
    ];
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Mobile viewport detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Define navigation links for business profile (Removed About)
  const navLinks = [
    {
      value: "home",
      mobileTitle: "Home",
      mobileIcon: Home,
    },
    {
      value: "brands",
      mobileTitle: "Brands",
      mobileIcon: Grid3X3,
    },
    {
      value: "products",
      mobileTitle: "Products",
      mobileIcon: ShoppingBag,
    },
    {
      value: "portfolio",
      mobileTitle: "Portfolio",
      mobileIcon: Briefcase,
    },
  ];

  // Handle view change from mobile navigation
  const handleViewChange = (view: string) => {
    setActiveSection(view);
    const container = mainContentRef.current;
    if (view === "home" && container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const refMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
        about: aboutRef,
        brands: brandsRef,
        products: productsRef,
        portfolio: portfolioRef,
        contact: contactRef,
      };
      const ref = refMap[view];
      if (ref?.current && container) {
        const offset = 80;
        const elementPosition = ref.current.offsetTop;
        const offsetPosition = elementPosition - offset;
        container.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setMobileMenuOpen(false);
  };

  // Helper to render the Business Info Card content (Sidebar)
  const BusinessInfoCard = () => (
    <div className="flex flex-col gap-3 lg:gap-4 w-full">
      <Card className="relative  border border-orange-500 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 lg:p-4 flex flex-col items-center text-center w-full overflow-hidden">
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="shrink-0 flex items-center justify-center">
            {business.logo && business.logo.trim() !== "" ? (
              <img
                src={getOptimizedImageUrl(business.logo)}
                srcSet={generateSrcSet(business.logo)}
                sizes="(max-width: 640px) 80px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                alt={business.name}
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border shadow-sm">
                <Image className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5 w-full min-w-0 text-center">
            <h3 className="font-extrabold text-lg text-gray-800 line-clamp-2 leading-tight">
              {business.name || "Business Name"}
            </h3>
            {business.category && (
              <span className="inline-flex items-center justify-center text-xs px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-medium w-fit mx-auto">
                <Building2 className="w-3 h-3 mr-1 text-orange-700" />
                {business.category.name}
              </span>
            )}
            {business.description && (
              <p className="text-xs text-gray-600 line-clamp-4">
                {business.description}
              </p>
            )}
            {business.admin?.name && (
              <span className="flex items-center justify-center text-xs flex-1 rounded-full py-1 px-3 bg-slate-900 text-gray-200 border border-gray-200 font-semibold w-fit mx-auto">
                <User className="w-3 h-3 mr-1 text-gray-100" />
                {business.admin.name}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons - Call, WhatsApp, Email */}
      <div className="flex flex-row gap-2 w-full">
        {/* Call Button */}
        {business.phone && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium shadow-sm cursor-pointer"
            onClick={() => {
              if (business.phone) {
                window.location.href = `tel:${business.phone}`;
              } else {
                alert("Phone number not available");
              }
            }}
            title="Call this number"
          >
            <Phone className="h-3 w-3" />
            Call
          </Button>
        )}
        <Button
          size="sm"
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white hover:bg-[#1DA851] transition-colors text-xs font-medium shadow-sm border-0 cursor-pointer"
          style={{ backgroundColor: "#25D366" }}
          onClick={() => {
            if (business.phone) {
              const phoneNum = business.phone.replace(/[^\d]/g, "");
              const waUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(`Hi, I'm interested in ${business.name}${business.category?.name ? ` (${business.category.name})` : ""}`)}`;
              window.open(waUrl, "_blank");
            } else {
              alert("No WhatsApp number available");
            }
          }}
          title="Contact via WhatsApp"
        >
          <SiWhatsapp className="h-3 w-3" />
          WhatsApp
        </Button>
        {business.email && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium shadow-sm cursor-pointer"
            onClick={() => {
              if (business.email) {
                window.location.href = `mailto:${business.email}?subject=Inquiry about ${encodeURIComponent(business.name || "")}`;
              } else {
                alert("Email not available");
              }
            }}
            title="Send email"
          >
            <Mail className="h-3 w-3" />
            Email
          </Button>
        )}
      </div>

      {/* Secondary Action Buttons - Download Row */}
      <div className="flex flex-row gap-2 w-full">
        {/* Download Card Button */}
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium shadow-sm cursor-pointer"
          onClick={() => {
            const cardData = `BEGIN:VCARD
                              VERSION:3.0
                              FN:${business.name || ""}
                              ORG:${business.category?.name || ""}
                              TEL:${business.phone || ""}
                              EMAIL:${business.email || ""}
                              URL:${business.website || ""}
                              ADR:;;${business.address || ""};;;;
                              NOTE:${business.description || ""}
                              END:VCARD`;

            const blob = new Blob([cardData], { type: "text/vcard" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${business.name || "business"}_card.vcf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          title="Download business card"
        >
          <Download className="h-3 w-3" />
          Download Card
        </Button>
        {/* Download Catalog PDF Button */}
        {business.catalogPdf && (
          <Button
            variant="default"
            size="sm"
            className="flex-1 flex items-center justify-center gap-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors text-xs font-medium shadow-sm cursor-pointer"
            onClick={() => {
              const pdfUrl = business.catalogPdf;
              if (pdfUrl) {
                window.open(pdfUrl, "_blank");
              } else {
                alert("Catalog PDF not available");
              }
            }}
            title="Download catalog PDF"
          >
            <Download className="h-3 w-3" />
            Download Catalog
          </Button>
        )}
      </div>

      {/* Share Button - Third Row */}
      <div className="flex flex-row gap-2 w-full">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-xs font-medium shadow-sm cursor-pointer"
          onClick={() => {
            if (navigator.share) {
              navigator
                .share({
                  title: business.name || "Business Profile",
                  text: business.description || `Check out ${business.name}`,
                  url: window.location.href,
                })
                .catch((err) => console.log("Error sharing:", err));
            } else {
              navigator.clipboard
                .writeText(window.location.href)
                .then(() => {
                  alert("Link copied to clipboard!");
                })
                .catch((err) => console.log("Error copying link:", err));
            }
          }}
          title="Share this business profile"
        >
          <Share2 className="h-3 w-3" />
          Share
        </Button>
      </div>

      {/* Contact Details Card */}
      <Card className="rounded-2xl shadow-md bg-slate-900 hover:shadow-md transition-shadow duration-300 px-3 py-3 flex flex-col items-stretch h-full w-full relative">
        <div className="flex flex-col gap-3 w-full items-center justify-between relative z-10">
          <div className="flex flex-col flex-1 min-w-0 space-y-2.5 w-full">
            {business.address && business.address.trim() !== "" && (
              <div className="flex items-start gap-2.5 group">
                <span className="inline-flex items-center justify-center rounded-full border bg-white/15 border-orange-300/50 group-hover:border-orange-400 transition-colors w-7 h-7 mt-0.5 shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-gray-100 group-hover:text-orange-300 transition-colors" />
                </span>
                <span className="text-xs text-white hover:text-orange-300 font-semibold leading-snug wrap-break-word">
                  {business.address}
                </span>
              </div>
            )}
            {business.phone && business.phone.trim() !== "" && (
              <div className="flex items-center gap-2.5 group">
                <span className="inline-flex items-center justify-center rounded-full border bg-white/15 border-orange-300/50 group-hover:border-orange-400 transition-colors w-7 h-7 shrink-0">
                  <Phone className="h-3.5 w-3.5 text-gray-100 group-hover:text-orange-300 transition-colors shrink-0" />
                </span>
                <a
                  href={`tel:${business.phone}`}
                  className="text-xs text-white hover:text-orange-300 hover:underline font-semibold break-all"
                  title="Call this number"
                >
                  {business.phone}
                </a>
              </div>
            )}
            {business.email && business.email.trim() !== "" && (
              <div className="flex items-center gap-2.5 group">
                <span className="inline-flex items-center justify-center rounded-full border bg-white/15 border-orange-300/50 group-hover:border-orange-400 transition-colors w-7 h-7 shrink-0">
                  <Mail className="h-3.5 w-3.5 text-gray-100 group-hover:text-orange-300 transition-colors shrink-0" />
                </span>
                <a
                  href={`mailto:${business.email}`}
                  className="text-xs text-white hover:text-orange-300 hover:underline font-semibold break-all"
                  title="Send email"
                >
                  {business.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        {(business.facebook ||
          business.twitter ||
          business.instagram ||
          business.linkedin ||
          business.website) && (
          <div className="w-full border-t pt-4 border-gray-200/80 mt-1 relative z-10">
            <div className="flex flex-wrap gap-2 w-full justify-center items-center">
              {business.website && (
                <a
                  href={
                    business.website.startsWith("http")
                      ? business.website
                      : `https://${business.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
                  aria-label="Website"
                >
                  <Globe className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                </a>
              )}
              {business.facebook && (
                <a
                  href={
                    business.facebook.startsWith("http")
                      ? business.facebook
                      : `https://${business.facebook}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors group"
                  aria-label="Facebook"
                >
                  <SiFacebook className="h-4 w-4 text-blue-600 group-hover:text-blue-800" />
                </a>
              )}
              {business.twitter && (
                <a
                  href={
                    business.twitter.startsWith("http")
                      ? business.twitter
                      : `https://${business.twitter}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
                  aria-label="Twitter"
                >
                  <SiX className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
                </a>
              )}
              {business.instagram && (
                <a
                  href={
                    business.instagram.startsWith("http")
                      ? business.instagram
                      : `https://${business.instagram}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors group"
                  aria-label="Instagram"
                >
                  <SiInstagram className="h-4 w-4 text-pink-600 group-hover:text-pink-800" />
                </a>
              )}
              {business.linkedin && (
                <a
                  href={
                    business.linkedin.startsWith("http")
                      ? business.linkedin
                      : `https://${business.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors group"
                  aria-label="LinkedIn"
                >
                  <SiLinkedin className="h-4 w-4 text-blue-600 group-hover:text-blue-800" />
                </a>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const SkeletonLayout = () => (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      {/* Header Skeleton */}
      <header className="shrink-0 bg-white shadow-sm border-b z-50">
        <div className="w-full mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 shrink-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              <Skeleton className="h-6 w-32 hidden md:block" />
            </div>
            <nav className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-20 rounded-lg" />
                ))}
              </div>
            </nav>
            <Skeleton className="h-10 w-10 rounded-lg md:hidden" />
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-hidden">
        {/* Sidebar Skeleton */}
        <aside className="hidden md:block md:col-span-1 h-full overflow-y-auto z-20">
          <div className="flex flex-col p-4 lg:gap-4 w-full space-y-4">
            {/* Business Info Card */}
            <Skeleton className="h-64 w-full rounded-2xl" />
            {/* Action Buttons */}
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
            {/* Contact Card */}
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="md:col-span-3 h-full overflow-y-auto mb-5 relative scroll-smooth min-w-0">
          <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 pt-4 space-y-6 lg:space-y-8">
            {/* Hero Section */}
            <section className="relative w-full mx-auto">
              <Skeleton className="h-48 md:h-80 w-full rounded-xl md:rounded-3xl" />
            </section>

            {/* Mobile Business Info Card */}
            <div className="md:hidden">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>

            {/* Brands Section */}
            <section className="py-6 md:py-12 px-0">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4 md:mb-8">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            </section>

            {/* Products Section */}
            <section className="">
              <div className="w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start sm:items-center gap-4 mb-6">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-8 w-24" />
                </div>

                {/* Search Bar */}
                <div className="sticky top-0 z-30 mb-6">
                  <div className="flex flex-row gap-3 py-2">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                  </div>
                </div>

                {/* Product Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            </section>

            {/* Portfolio Section */}
            <section className="w-full my-8 md:my-12 px-0">
              <div className="flex justify-between items-center mb-4 md:mb-8">
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4 md:grid-rows-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            </section>

            {/* About Section */}
            <section className="w-full py-8 md:py-12 bg-white rounded-3xl shadow-sm px-6 md:px-8">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </section>
          </div>

          {/* Mobile Navigation Skeleton */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center gap-2 px-3 py-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-16 rounded-none" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  if (isLoading) {
    return <SkeletonLayout />;
  }

  return (
    // DASHBOARD LAYOUT CONTAINER
    <div
      className="h-screen w-full overflow-hidden bg-orange-50 flex flex-col"
      suppressHydrationWarning
    >
      {/* PAGE HEADER - HIDDEN ON MOBILE (hidden md:flex) */}
      <header className="shrink-0 bg-white shadow-sm border-b z-50 hidden md:flex">
        <div className="w-full mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Business Name */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {business.logo && business.logo.trim() !== "" ? (
                  <img
                    src={getOptimizedImageUrl(business.logo)}
                    alt={business.name}
                    className="h-10 w-10 rounded-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              <span className="text-lg font-bold text-gray-900 hidden md:block">
                {business.name}
              </span>
            </div>

            {/* Desktop Navigation - Centered - About Link Removed */}
            <nav className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex space-x-2">
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    activeSection === "home"
                      ? "text-orange-600 bg-orange-50 border border-orange-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() => {
                    setActiveSection("home");
                    mainContentRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <Home
                    className={`w-4 h-4 mr-2 transition-colors ${
                      activeSection === "home"
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  />
                  Home
                </button>
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    activeSection === "brands"
                      ? "text-orange-600 bg-orange-50 border border-orange-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() =>
                    scrollToSection(
                      brandsRef as React.RefObject<HTMLDivElement>,
                      "brands",
                    )
                  }
                >
                  <Grid3X3
                    className={`w-4 h-4 mr-2 transition-colors ${
                      activeSection === "brands"
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  />
                  Brands
                </button>
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    activeSection === "products"
                      ? "text-orange-600 bg-orange-50 border border-orange-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() =>
                    scrollToSection(
                      productsRef as React.RefObject<HTMLDivElement>,
                      "products",
                    )
                  }
                >
                  <ShoppingBag
                    className={`w-4 h-4 mr-2 transition-colors ${
                      activeSection === "products"
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  />
                  Products
                </button>
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    activeSection === "portfolio"
                      ? "text-orange-600 bg-orange-50 border border-orange-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() =>
                    scrollToSection(
                      portfolioRef as React.RefObject<HTMLDivElement>,
                      "portfolio",
                    )
                  }
                >
                  <Briefcase
                    className={`w-4 h-4 mr-2 transition-colors ${
                      activeSection === "portfolio"
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  />
                  Portfolio
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button - Hidden because Header is hidden on mobile anyway, but keeping code structure */}
            <div className="md:hidden shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">
              {/* About Link Removed from Mobile Menu */}
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  activeSection === "home" ? "text-orange-600" : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  setActiveSection("home");
                  mainContentRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  setMobileMenuOpen(false);
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  activeSection === "brands"
                    ? "text-orange-600"
                    : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  scrollToSection(
                    brandsRef as React.RefObject<HTMLDivElement>,
                    "brands",
                  );
                  setMobileMenuOpen(false);
                }}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Brands
              </button>
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  activeSection === "products"
                    ? "text-orange-600"
                    : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  scrollToSection(
                    productsRef as React.RefObject<HTMLDivElement>,
                    "products",
                  );
                  setMobileMenuOpen(false);
                }}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Products
              </button>
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  activeSection === "portfolio"
                    ? "text-orange-600"
                    : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  scrollToSection(
                    portfolioRef as React.RefObject<HTMLDivElement>,
                    "portfolio",
                  );
                  setMobileMenuOpen(false);
                }}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Portfolio
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-hidden">
        <aside className="hidden md:block md:col-span-1 h-full overflow-y-auto z-20  ">
          <div className="flex flex-col p-4 lg:gap-4 w-full">
            <BusinessInfoCard />
          </div>
        </aside>
        <main
          ref={mainContentRef}
          className="md:col-span-3 h-full overflow-y-auto mb-5 relative scroll-smooth min-w-0"
        >
          <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-8 pt-4 space-y-6 lg:space-y-8">
            <section className="relative w-full mx-auto">
              <div className=" aspect-4/2 bg-center md:aspect-3/1 w-full rounded-xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl bg-gray-900 relative">
                {heroContent.slides && safeSlides.length > 0 ? (
                  <>
                    {/* Check if first slide is a video */}
                    {(() => {
                      const firstSlide = heroContent.slides[0];
                      const isVideo =
                        firstSlide.mediaType === "video" ||
                        (firstSlide.media &&
                          (firstSlide.media.includes(".mp4") ||
                            firstSlide.media.includes(".webm") ||
                            firstSlide.media.includes(".ogg")));
                      const videoUrl = isVideo
                        ? firstSlide.media || firstSlide.image
                        : null;

                      // If first slide is video, show video player
                      if (isVideo && videoUrl) {
                        return (
                          <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={
                              firstSlide.image && firstSlide.image !== videoUrl
                                ? firstSlide.image
                                : undefined
                            }
                            onError={(e) => {
                              console.error("Video failed to load:", videoUrl);
                              const target = e.target as HTMLVideoElement;
                              target.style.display = "none";
                            }}
                          />
                        );
                      }

                      // Otherwise, show image slider
                      return (
                        <>
                          {/* Carousel Track - Added Touch Events for Swipe */}
                          <div
                            className="flex transition-transform duration-700 ease-in-out w-full h-full"
                            style={{
                              transform: `translateX(-${currentSlideIndex * 100}%)`,
                            }}
                            onTouchStart={(e) => {
                              setTouchEnd(null);
                              setTouchStart(e.targetTouches[0].clientX);
                            }}
                            onTouchMove={(e) => {
                              setTouchEnd(e.targetTouches[0].clientX);
                            }}
                            onTouchEnd={() => {
                              if (!touchStart || !touchEnd) return;
                              const distance = touchStart - touchEnd;
                              const isLeftSwipe = distance > 50;
                              const isRightSwipe = distance < -50;
                              if (isLeftSwipe) {
                                setCurrentSlideIndex((prev) =>
                                  prev < heroContent.slides.length - 1
                                    ? prev + 1
                                    : 0,
                                );
                              }
                              if (isRightSwipe) {
                                setCurrentSlideIndex((prev) =>
                                  prev > 0
                                    ? prev - 1
                                    : heroContent.slides.length - 1,
                                );
                              }
                            }}
                            // Mouse events for desktop swipe
                            onMouseDown={(e) => {
                              setTouchEnd(null);
                              setTouchStart(e.clientX);
                            }}
                            onMouseMove={(e) => {
                              setTouchEnd(e.clientX);
                            }}
                            onMouseUp={() => {
                              if (!touchStart || !touchEnd) return;
                              const distance = touchStart - touchEnd;
                              const isLeftSwipe = distance > 50;
                              const isRightSwipe = distance < -50;
                              if (isLeftSwipe) {
                                setCurrentSlideIndex((prev) =>
                                  prev < heroContent.slides.length - 1
                                    ? prev + 1
                                    : 0,
                                );
                              }
                              if (isRightSwipe) {
                                setCurrentSlideIndex((prev) =>
                                  prev > 0
                                    ? prev - 1
                                    : heroContent.slides.length - 1,
                                );
                              }
                            }}
                            onMouseLeave={() => {
                              // Reset touch state when mouse leaves
                              setTouchStart(null);
                              setTouchEnd(null);
                            }}
                          >
                            {safeSlides
                              .filter((slide: any) => slide !== null && slide !== undefined)
                              .map(
                                (slide: any, index: number) => {
                                  const mediaUrl = slide.media || slide.image;
                                  return (
                                  <div
                                    key={index}
                                    className="w-full shrink-0 h-full relative"
                                  >
                                    {mediaUrl && mediaUrl.trim() !== "" ? (
                                      <img
                                        src={getOptimizedImageUrl(mediaUrl, {
                                          width: 1600,
                                          quality: 90,
                                          format: "auto",
                                          crop: "fill",
                                          gravity: "auto",
                                        })}
                                        alt={`Slide ${index + 1}`}
                                        className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${
                                          index === currentSlideIndex
                                            ? "scale-105"
                                            : "scale-100"
                                        }`}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                        onError={(e) => {
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.style.display = "none";
                                        }}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <ImageOff className="h-12 w-12 md:h-24 md:w-24 text-gray-300" />
                                      </div>
                                    )}
                                  </div>
                                );
                              },
                            )}
                          </div>

                          {/* Navigation Arrows - Size decreased on mobile */}
                          {heroContent.showArrows !== false &&
                            safeSlides.length > 1 && (
                              <>
                                <button
                                  onClick={() =>
                                    setCurrentSlideIndex((prev) =>
                                      prev > 0
                                        ? prev - 1
                                        : heroContent.slides.length - 1,
                                    )
                                  }
                                  className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 
                               bg-white/10 hover:bg-white/20 backdrop-blur-md 
                               border border-white/20 text-white 
                               rounded-full p-1 md:p-3 
                               transition-all duration-300 hover:scale-110 z-20 group/btn"
                                  aria-label="Previous Slide"
                                >
                                  <ChevronLeft className="h-3 w-3 md:h-5 md:w-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                                <button
                                  onClick={() =>
                                    setCurrentSlideIndex((prev) =>
                                      prev < heroContent.slides.length - 1
                                        ? prev + 1
                                        : 0,
                                    )
                                  }
                                  className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 
                               bg-white/10 hover:bg-white/20 backdrop-blur-md 
                               border border-white/20 text-white 
                               rounded-full p-1 md:p-3 
                               transition-all duration-300 hover:scale-110 z-20 group/btn"
                                  aria-label="Next Slide"
                                >
                                  <ChevronRight className="h-3 w-3 md:h-5 md:w-5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              </>
                            )}

                          {/* Pagination Dots - Size decreased on mobile */}
                          {heroContent.showDots !== false &&
                            safeSlides.length > 1 && (
                              <div className="absolute bottom-2  left-0 right-0 flex justify-center items-center space-x-2 md:space-x-3 z-20">
                                {safeSlides
                                  .filter((slide: any) => slide !== null && slide !== undefined)
                                  .map(
                                    (_: any, index: number) => (
                                    <button
                                      key={index}
                                      onClick={() =>
                                        setCurrentSlideIndex(index)
                                      }
                                      className={`
                            h-1.5 md:h-2 rounded-full transition-all duration-300
                            ${
                              index === currentSlideIndex
                                ? "w-4 md:w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                : "w-1.5 md:w-2 bg-white/50 hover:bg-white/80"
                            }
                          `}
                                      aria-label={`Go to slide ${index + 1}`}
                                    />
                                  ),
                                )}
                              </div>
                            )}
                        </>
                      );
                    })()}
                  </>
                ) : (
                  // Fallback: ImageOff Icon when no media is present
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <ImageOff className="h-12 w-12 md:h-24 md:w-24 text-gray-300 mb-2" />
                    <p className="text-sm md:text-lg text-gray-500 font-medium">
                      No banner configured
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Mobile View: Business Profile Card - Show after banner */}
            <div className="md:hidden mt-6 mb-8">
              <BusinessInfoCard />
            </div>

            {safeBrands.length > 0 && (
              <section
                id="brands"
                ref={brandsRef}
                className="py-6 md:py-12 px-0"
              >
                <div className="w-full">
                  <div className="flex  justify-between items-center mb-4 md:mb-8">
                    <h2 className="text-lg md:text-2xl font-bold">
                      Trusted By
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setViewAllBrands(!viewAllBrands);
                      }}
                    >
                      {viewAllBrands ? "Show Less" : "View All"}
                    </Button>
                  </div>
                  {viewAllBrands ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                      {safeBrands
                        .filter((brand: any) => brand !== null && brand !== undefined)
                        .map((brand: any, index: number) => (
                          <div
                            key={index}
                          className="flex flex-col h-full cursor-pointer transition-all duration-300"
                          onClick={() =>
                            setSelectedBrand(
                              selectedBrand === brand.name ? null : brand.name,
                            )
                          }
                        >
                          <Card
                            className={`overflow-hidden rounded-2xl   p-0 md:rounded-3xl cursor-pointer transition-all duration-300 h-full flex items-center justify-center flex-col ${
                              selectedBrand === brand.name
                                ? "bg-orange-50 border-2 border-orange-400 shadow-2xl"
                                : "bg-white/70 hover:bg-white/90 hover:shadow-md"
                            }`}
                          >
                            {/* Container with Fixed Height and Full Width */}
                            <div className="relative w-full h-[180px] flex items-center justify-center bg-gray-50/50">
                              {brand.logo && brand.logo.trim() !== "" ? (
                                <img
                                  src={getOptimizedImageUrl(brand.logo, {
                                    width: 400,
                                    height: 300,
                                    quality: 85,
                                    format: "auto",
                                  })}
                                  srcSet={generateSrcSet(brand.logo)}
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                  alt={brand.name}
                                  // w-full fills the width, h-auto maintains aspect ratio, object-contain ensures the whole image is visible
                                  className="w-full my-auto mx-auto h-auto object-contain max-h-[180px]"
                                  loading="lazy"
                                />
                              ) : (
                                <Image className="h-10 w-10 text-gray-400" />
                              )}
                            </div>
                          </Card>
                          <p
                            className={`text-center text-xs md:text-base mt-2 font-semibold transition-colors wrap-break-word ${
                              selectedBrand === brand.name
                                ? "text-orange-400 font-700"
                                : "text-gray-700 font-semibold"
                            }`}
                          >
                            {brand.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Carousel
                      opts={{
                        loop: true,
                        dragFree: false,
                        align: "start",
                        watchDrag: true,
                        watchResize: true,
                        watchSlides: true,
                      }}
                      className="w-full"
                      suppressHydrationWarning
                    >
                      <CarouselContent>
                        {safeBrands
                          .filter((brand: any) => brand !== null && brand !== undefined)
                          .map(
                            (brand: any, index: number) => (
                            <CarouselItem
                              key={index}
                              className="basis-1/2 md:basis-1/4 lg:basis-1/5"
                            >
                              <div
                                className="flex flex-col h-full cursor-pointer transition-all duration-300"
                                onClick={() =>
                                  setSelectedBrand(
                                    selectedBrand === brand.name
                                      ? null
                                      : brand.name,
                                  )
                                }
                              >
                                <Card
                                  className={`overflow-hidden rounded-2xl p-0 md:rounded-3xl cursor-pointer items-center justify-center transition-all duration-300 h-full flex flex-col ${
                                    selectedBrand === brand.name
                                      ? "bg-orange-50 border-2 border-orange-400 shadow-2xl"
                                      : "bg-white/70 hover:bg-white/90 hover:shadow-md"
                                  }`}
                                >
                                  {/* Container with Fixed Height and Full Width */}
                                  <div className="relative w-full h-[180px] flex items-center justify-center bg-gray-50/50">
                                    {brand.logo && brand.logo.trim() !== "" ? (
                                      <img
                                        src={getOptimizedImageUrl(brand.logo, {
                                          width: 400,
                                          height: 300,
                                          quality: 85,
                                          format: "auto",
                                        })}
                                        srcSet={generateSrcSet(brand.logo)}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        alt={brand.name}
                                        // w-full fills the width, h-auto maintains aspect ratio, object-contain ensures the whole image is visible
                                        className="w-full my-auto mx-auto h-auto object-contain max-h-[180px]"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <Image className="h-10 w-10 text-gray-400" />
                                    )}
                                  </div>
                                </Card>
                                <p
                                  className={`text-center text-xs md:text-base mt-2 font-semibold transition-colors wrap-break-word ${
                                    selectedBrand === brand.name
                                      ? "text-orange-400 font-700"
                                      : "text-gray-700 font-semibold"
                                  }`}
                                >
                                  {brand.name}
                                </p>
                              </div>
                            </CarouselItem>
                          ),
                        )}
                      </CarouselContent>
                      <div className="hidden md:block">
                        <CarouselPrevious className="left-2 md:left-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
                        <CarouselNext className="right-2 md:right-4 bg-white/80 hover:bg-white text-gray-800 border-0 shadow-lg" />
                      </div>
                    </Carousel>
                  )}
                </div>
              </section>
            )}

            {business.products.length > 0 && (
              <section id="products" ref={productsRef} className="">
                <div className="w-full mx-auto">
                  {/* Header */}
                  <div className="flex  justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">
                        Our Products & Services
                      </h2>
                      {selectedBrand && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-none"
                          >
                            Filtered by: {selectedBrand}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedBrand(null)}
                            className="text-orange-600 hover:text-orange-800 h-7 px-2 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Clear
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewAllProducts(!viewAllProducts)}
                      className=" border-gray-300"
                    >
                      {viewAllProducts ? "Show Less" : "View All"}
                    </Button>
                  </div>

                  {/* Sticky Search Bar */}
                  <div className="sticky top-0 z-30 mb-6">
                    {mounted && (
                      <div
                        className="flex flex-row gap-3 py-2 backdrop-blur-lg"
                        suppressHydrationWarning
                      >
                        <div className="relative flex-1 min-w-0">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 bg-gray-50 border-gray-200 focus-visible:ring-orange-500 text-sm"
                          />
                        </div>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="w-[100px] shrink-0 h-10 bg-gray-50 border-gray-200 text-sm">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {categories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Reusable Product Card Component */}
                  {(() => {
                    const ProductCard = ({ product }) => (
                      <Card
                        id={`product-${product.id}`}
                        className="group overflow-hidden p-0 rounded-2xl border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col h-full bg-white"
                      >
                        {/* Image Section - Reduced Height on Mobile */}
                        <div
                          className="relative w-full h-48 md:h-64 overflow-hidden cursor-pointer bg-gray-100"
                          onClick={() => openProductModal(product)}
                        >
                          {product.image && product.image.trim() !== "" ? (
                            <img
                              src={getOptimizedImageUrl(product.image, {
                                width: 500,
                                height: 500,
                                quality: 85,
                                format: "auto",
                              })}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-50">
                              <ImageOff className="h-10 w-10 text-gray-300" />
                            </div>
                          )}

                          {/* Stock Badge */}
                          <div className="absolute top-0 right-0">
                            <Badge
                              className={`absolute top-3 text-white right-3 ${
                                product.inStock
                                  ? "bg-linear-to-l from-gray-900 to-lime-900"
                                  : "bg-linear-to-l from-gray-900 to-red-900"
                              } text-white border-0`}
                            >
                              {product.inStock ? (
                                <span className="flex items-center gap-1">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                                  </span>{" "}
                                  In Stock
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                                  </span>{" "}
                                  Out of Stock
                                </span>
                              )}
                            </Badge>
                          </div>
                        </div>

                        {/* Content Section - Adjusted Padding & Text Size */}
                        <div className="p-3   flex flex-col flex-1">
                          <div className="flex justify-between items-start gap-2 mb-1 sm:mb-2">
                            <h3
                              className="font-semibold text-slate-800 line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors text-xs md:text-sm sm:text-base"
                              onClick={() => openProductModal(product)}
                            >
                              {product.name}
                            </h3>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-3">
                            {product.brandName && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1.5 py-0.5 rounded-full border-gray-200 text-gray-500 "
                              >
                                <Grid2X2Check className="h-4 w-4 mr-1" />
                                {product.brandName}
                              </Badge>
                            )}
                            {product.category && (
                              <Badge
                                variant="outline"
                                className="text-xs px-1.5 py-0.5 rounded-full border-gray-200 text-gray-500 "
                              >
                                <Tag className="h-4 w-4 mr-1" />
                                {product.category.name}
                              </Badge>
                            )}
                          </div>

                          <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed flex-1">
                            {product.description || "No description available."}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2 mt-auto">
                            <Button
                              className="flex-1 bg-green-500 hover:bg-black text-white h-8 sm:h-9 text-[10px] sm:text-xs font-medium rounded-lg"
                              onClick={() => {
                                if (business.phone) {
                                  const productLink = `${window.location.origin}/catalog/${business.slug}?product=${product.id}&modal=open`;
                                  const message = `Hi, I'm interested in ${product.name}\n\n${productLink}`;
                                  const whatsappUrl = `https://wa.me/${business.phone.replace(
                                    /[^\d]/g,
                                    "",
                                  )}?text=${encodeURIComponent(message)}`;
                                  window.open(whatsappUrl, "_blank");
                                } else {
                                  alert("Phone number not available");
                                }
                              }}
                            >
                              Inquire
                              <SiWhatsapp className="h-3 w-3 ml-1" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(product);
                              }}
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );

                    return viewAllProducts ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {filteredProducts.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full -mx-4 px-4 md:mx-0 md:px-0"
                      >
                        <CarouselContent>
                          {filteredProducts.map((product) => (
                            <CarouselItem
                              key={product.id}
                              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pl-4 md:pl-4"
                            >
                              <ProductCard product={product} />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        {/* Carousel Navigation */}
                        <div className="hidden md:flex justify-end gap-2 mt-4">
                          <CarouselPrevious className="static w-10 h-10 rounded-full border-gray-200 hover:bg-gray-100" />
                          <CarouselNext className="static w-10 h-10 rounded-full border-gray-200 hover:bg-gray-100" />
                        </div>
                      </Carousel>
                    );
                  })()}
                </div>
              </section>
            )}

            {/* Portfolio Section - Enhanced for Mobile */}
            {safePortfolioImages.length > 0 && (
              <section
                className="w-full my-8 md:my-12 px-0"
                id="portfolio"
                ref={portfolioRef}
              >
                <div className="flex justify-between items-center mb-4 md:mb-8">
                  <h2 className="text-lg md:text-2xl font-bold">Portfolio</h2>
                </div>

                <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4 md:grid-rows-2">
                  {safePortfolioImages
                    .filter((image: any) => image !== null && image !== undefined)
                    .slice(0, 6)
                    .map((image: any, index: number) => {
                      // Define grid positions for bento layout
                      const gridClasses = [
                        "md:row-span-2 md:col-span-2 col-span-2 row-span-1", // Large top-left
                        "md:row-span-1 md:col-span-1 col-span-1", // Top-right small
                        "md:row-span-1 md:col-span-1 col-span-1", // Top-right small
                        "md:row-span-2 md:col-span-2 col-span-2 row-span-1 md:col-start-3 md:row-start-1", // Large bottom
                        "md:row-span-1 md:col-span-1 col-span-1", // Bottom-left small
                        "md:row-span-1 md:col-span-1 col-span-1", // Bottom-right small
                      ];

                      const isVideo =
                        image.url &&
                        (image.url.includes(".mp4") ||
                          image.url.includes(".webm") ||
                          image.url.includes(".ogg"));

                      return (
                        <div
                          key={index}
                          className={`bg-gray-100 border rounded-xl shadow-sm flex items-center justify-center hover:shadow transition-shadow bg-center bg-cover relative overflow-hidden ${gridClasses[index] || "md:row-span-1 md:col-span-1"} ${index === 0 || index === 3 ? "min-h-[140px] md:min-h-[180px]" : "min-h-[100px] md:min-h-[120px]"}`}
                          style={{
                            aspectRatio:
                              index === 0 || index === 3 ? "2/1" : "1/1",
                          }}
                        >
                          {isVideo ? (
                            <video
                              src={image.url}
                              className="w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                              style={{ pointerEvents: "none" }}
                            />
                          ) : image.url ? (
                            <img
                              src={getOptimizedImageUrl(image.url, {
                                width: index === 0 || index === 3 ? 600 : 300,
                                height: index === 0 || index === 3 ? 300 : 300,
                                quality: 85,
                                format: "auto",
                                crop: "fill",
                                gravity: "auto",
                              })}
                              srcSet={generateSrcSet(image.url)}
                              sizes={
                                index === 0 || index === 3
                                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  : "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                              }
                              alt={image.alt || "Portfolio image"}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <span
                              className={`flex items-center justify-center rounded-full bg-gray-200 ${index === 0 || index === 3 ? "w-[60px] h-[60px] md:w-20 md:h-20" : "w-10 h-10 md:w-14 md:h-14"}`}
                            >
                              <Image
                                className={`text-gray-400 ${index === 0 || index === 3 ? "w-8 h-8 md:w-10 md:h-10" : "w-6 h-6 md:w-8 md:h-8"}`}
                              />
                            </span>
                          )}

                          {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-2">
                                <svg
                                  className="w-4 h-4 md:w-6 md:h-6 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* About Us Text & Opening Hours (Moved to Main Content) */}
            <section className="w-full py-8   md:py-12 bg-white rounded-3xl shadow-sm px-6 md:px-8">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                {/* Right Side: Opening Hours & GST Number */}
                <div className="flex-1">
                
                  <div className="space-y-4 flex justify-between">
                    <div>
                      <Label className="flex flex-2  text-gray-600 mb-1">
                        Opening Hours
                      </Label>
                      {business.openingHours &&
                      business.openingHours.length > 0 ? (
                        <ul className="text-sm flex-1 text-gray-800">
                          {business.openingHours.map(
                            (item: any, idx: number) => (
                              <li
                                key={idx}
                                className="flex flex-1 gap-5 justify-between items-center py-0.5"
                              >
                                <span className="font-medium">{item.day}</span>
                                <span></span>
                                <span></span>
                                <span>
                                  {item.open && item.close
                                    ? `${item.open} - ${item.close}`
                                    : "Closed"}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400">Not provided</p>
                      )}
                    </div>
                    <div>
                      <Label className="block text-gray-600 mb-1">
                        GST Number
                      </Label>
                      <p className="text-sm text-gray-800">
                        {business.gstNumber || (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Mobile Bottom Navigation - All 4 items visible directly (About removed) */}
          {isMobile && (
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
              <div className="flex justify-around items-center gap-2 px-3">
                {navLinks.map((item) => {
                  const MobileIcon = item.mobileIcon;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleViewChange(item.value)}
                      className={`flex flex-col items-center justify-center py-2 w-full rounded-none transition-all duration-200 ${
                        activeSection === item.value
                          ? "text-orange-400 font-extrabold border-t-4 rounded-none border-orange-400"
                          : "text-gray-500 border-t-4 border-transparent hover:text-gray-700"
                      }`}
                    >
                      <MobileIcon className="h-5 w-5 mb-0.5" />
                      <span className="text-xs font-medium">
                        {item.mobileTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Inquiry Modal */}
      <Dialog open={inquiryModal} onOpenChange={setInquiryModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct
                ? `Inquire about ${selectedProduct.name}`
                : "Get in Touch"}
            </DialogTitle>
            <DialogDescription>
              Send us a message and we'll get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInquiry} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={inquiryData.name}
                onChange={(e) =>
                  setInquiryData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={inquiryData.email}
                onChange={(e) =>
                  setInquiryData((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={inquiryData.phone}
                onChange={(e) =>
                  setInquiryData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={inquiryData.message}
                onChange={(e) =>
                  setInquiryData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                rows={4}
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Inquiry
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setInquiryModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={productModal} onOpenChange={setProductModal}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl">
              {selectedProductModal?.name}
            </DialogTitle>
            <DialogDescription>
              Product details and related items
            </DialogDescription>
          </DialogHeader>

          {selectedProductModal && (
            <div className="space-y-6">
              {/* Product Image */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-md h-64 md:h-80 rounded-lg overflow-hidden border border-gray-200 shadow-sm ">
                  {selectedProductModal.image &&
                  selectedProductModal.image.trim() !== "" ? (
                    <img
                      src={getOptimizedImageUrl(selectedProductModal.image, {
                        width: 600,
                        height: 400,
                        quality: 90,
                        format: "auto",
                        crop: "fill",
                        gravity: "center",
                      })}
                      srcSet={generateSrcSet(selectedProductModal.image)}
                      sizes="(max-width: 768px) 100vw, 600px"
                      alt={selectedProductModal.name}
                      className="w-full h-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <Image className="h-16 w-16 md:h-24 md:w-24 text-gray-400" />
                    </div>
                  )}
                  <Badge
                    className={`absolute top-3 text-white right-3 ${
                      selectedProductModal.inStock
                        ? "bg-linear-to-l from-gray-900 to-lime-900"
                        : "bg-linear-to-l from-gray-900 to-red-900"
                    } text-white border-0`}
                  >
                    {selectedProductModal.inStock ? (
                      <span className="flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>{" "}
                        In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                        </span>{" "}
                        Out of Stock
                      </span>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedProductModal.brandName && (
                    <Badge variant="outline" className="text-sm">
                      {selectedProductModal.brandName}
                    </Badge>
                  )}
                  {selectedProductModal.category && (
                    <Badge variant="outline" className="text-sm">
                      {selectedProductModal.category.name}
                    </Badge>
                  )}
                </div>

                {selectedProductModal.price && (
                  <div className="text-2xl font-bold text-green-600">
                    {selectedProductModal.price}
                  </div>
                )}

                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProductModal.description ||
                      "No description available"}
                  </p>
                </div>

                {/* Additional Information Section */}
                {selectedProductModal.additionalInfo &&
                  Object.keys(selectedProductModal.additionalInfo).length >
                    0 && (
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Additional Information
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                Property
                              </th>
                              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {Object.entries(
                              selectedProductModal.additionalInfo,
                            ).map(([key, value], index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-700">
                                  {value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Products Components</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {relatedProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden pt-0 py-0 bg-white hover:shadow-lg transition-shadow duration-300 pb-2 cursor-pointer"
                        onClick={() => setSelectedProductModal(product)}
                      >
                        <div className="relative h-32 md:h-48">
                          {product.image && product.image.trim() !== "" ? (
                            <img
                              src={getOptimizedImageUrl(product.image, {
                                width: 400,
                                height: 300,
                                quality: 85,
                                format: "auto",
                                crop: "fill",
                                gravity: "center",
                              })}
                              srcSet={generateSrcSet(product.image)}
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Image className="h-10 w-10 md:h-16 md:w-16 text-gray-400" />
                            </div>
                          )}
                          <Badge
                            className={`absolute top-3 text-white right-3 ${
                              selectedProductModal.inStock
                                ? "bg-linear-to-l from-gray-900 to-lime-900"
                                : "bg-linear-to-l from-gray-900 to-red-900"
                            } text-white border-0`}
                          >
                            {product.inStock ? (
                              <span className="flex items-center gap-1">
                                {product.inStock && (
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                  </span>
                                )}{" "}
                                In Stock
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>{" "}
                                Out of Stock
                              </span>
                            )}
                          </Badge>
                        </div>
                        <CardHeader className="pb-0 px-2 md:px-3 ">
                          <CardTitle className="text-xs  md:text-lg line-clamp-1">
                            {product.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 px-2 md:px-3 ">
                          <div className="flex flex-row flex-nowrap gap-1 mb-2 md:mb-3 overflow-x-auto hide-scrollbar">
                            {product.brandName && (
                              <Badge
                                variant="outline"
                                className="text-[8px] md:text-xs px-1 md:px-2 py-0.5 h-4 md:h-5 min-w-max"
                              >
                                {product.brandName}
                              </Badge>
                            )}
                            {product.category && (
                              <Badge
                                variant="outline"
                                className="text-[8px] md:text-xs px-1 md:px-2 py-0.5 h-4 md:h-5 min-w-max"
                              >
                                {product.category.name}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mb-2 md:mb-4 text-[10px]  md:text-sm leading-relaxed line-clamp-2">
                            {product.description || "No description available"}
                          </CardDescription>
                          <div className="flex-1 "></div>
                          <Button
                            className="w-full mt-auto bg-green-500 hover:bg-slate-900 text-white cursor-pointer text-xs md:text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (business.phone) {
                                const productLink = `${window.location.origin}/catalog/${business.slug}?product=${product.id}&modal=open`;
                                const message = `${product.name}\n\nDescription: ${product.description}\n\nLink: ${productLink}`;
                                const whatsappUrl = `https://wa.me/${business.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;
                                try {
                                  window.open(whatsappUrl, "_blank");
                                } catch (error) {
                                  alert(
                                    "Unable to open WhatsApp. Please ensure WhatsApp is installed or try on a mobile device.",
                                  );
                                }
                              } else {
                                alert("Phone number not available");
                              }
                            }}
                          >
                            Inquire Now
                            <SiWhatsapp className=" h-3 w-3 md:h-4 md:w-4 ml-1 md:ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

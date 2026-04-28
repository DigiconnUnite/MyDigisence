"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  getOptimizedImageUrl,
  generateSrcSet,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Filter,
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
import BusinessInfoCard from "@/components/business-profile/BusinessInfoCard";
import BusinessProfileSkeleton from "@/components/business-profile/BusinessProfileSkeleton";
import ProductCard from "@/components/business-profile/ProductCard";
import BusinessHeroSection from "@/components/business-profile/BusinessHeroSection";
import BusinessBrandsSection from "@/components/business-profile/BusinessBrandsSection";
import BusinessPortfolioSection from "@/components/business-profile/BusinessPortfolioSection";
import BusinessInquiryModal from "@/components/business-profile/BusinessInquiryModal";
import BusinessProductModal from "@/components/business-profile/BusinessProductModal";
import {
  BusinessProfileProps,
  InquiryFormData,
  Product,
} from "@/components/business-profile/BusinessProfile.types";
import {
  getFilteredProducts,
  getProductShareUrl,
  getRelatedProducts,
  getSelectCategories,
  toWhatsappNumber,
  validateInquiryData,
} from "@/components/business-profile/businessProfile.utils";

export default function BusinessProfile({
  business: initialBusiness,
  categories: initialCategories = [],
}: BusinessProfileProps) {
  const PRODUCTS_PAGE_SIZE = 12;
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
  // Default to showing all products (View All). Carousel when false.
  const [viewAllProducts, setViewAllProducts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [lastUpdateCheck, setLastUpdateCheck] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleProductsCount, setVisibleProductsCount] = useState(
    PRODUCTS_PAGE_SIZE,
  );

  const { toast } = useToast();

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
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
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
    // Manual refresh by fetching current data using the correct API endpoint
    try {
      const response = await fetch(
        `/api/business?slug=${business.slug}`,
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
          toast({
            title: "Product Not Found",
            description: "The requested product could not be found.",
            variant: "destructive",
          });
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
    const categories = getSelectCategories(initialCategories);
    const filteredProducts = getFilteredProducts({
      products: business.products,
      searchTerm,
      selectedCategory,
      selectedBrand,
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
    return getRelatedProducts(business.products, selectedProductModal);
  }, [business.products, selectedProductModal]);

  const visibleFilteredProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleProductsCount);
  }, [filteredProducts, visibleProductsCount]);

  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategory === "all") return "All";
    return categories.find((category) => category.id === selectedCategory)?.name || "All";
  }, [categories, selectedCategory]);

  // Reset visible products when filters change.
  useEffect(() => {
    if (viewAllProducts) {
      setVisibleProductsCount(filteredProducts.length);
    } else {
      setVisibleProductsCount(PRODUCTS_PAGE_SIZE);
    }
  }, [searchTerm, selectedCategory, selectedBrand, PRODUCTS_PAGE_SIZE, viewAllProducts, filteredProducts.length]);

  // Infinite load-more trigger for products grid (only active if not already showing all items).
  useEffect(() => {
    if (!viewAllProducts) return;

    // If already showing all products, no need to set up the observer
    if (visibleProductsCount >= filteredProducts.length) return;

    const trigger = loadMoreTriggerRef.current;
    const scrollContainer = mainContentRef.current;
    if (!trigger) return;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          setVisibleProductsCount((prev) => {
            if (prev >= filteredProducts.length) return prev;
            return Math.min(prev + PRODUCTS_PAGE_SIZE, filteredProducts.length);
          });
        });
      },
      {
        root: scrollContainer,
        rootMargin: "300px 0px",
        threshold: 0,
      },
    );

    observer.observe(trigger);

    return () => {
      observer.disconnect();
    };
  }, [viewAllProducts, filteredProducts.length, PRODUCTS_PAGE_SIZE, visibleProductsCount]);

  const handleInquiry = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const errors = validateInquiryData(inquiryData);

        if (errors.length > 0) {
          toast({
            title: "Validation Error",
            description: errors.join("\n"),
            variant: "destructive",
          });
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
          toast({
            title: "Inquiry Submitted",
            description: "We will get back to you soon!",
          });
          setInquiryModal(false);
          setInquiryData({ name: "", email: "", phone: "", message: "" });
          setSelectedProduct(null);
        } else {
          toast({
            title: "Error",
            description: result.error || "Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Inquiry submission error:", error);
        toast({
          title: "Error",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [inquiryData, business.id, selectedProduct],
  );

  const handleShare = useCallback(
    (product: Product) => {
      const shareUrl = getProductShareUrl({
        businessSlug: business.slug,
        productId: product.id,
      });
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
            toast({
              title: "Link Copied",
              description: "Link copied to clipboard!",
            });
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Failed to copy link",
              variant: "destructive",
            });
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

  const handleProductWhatsappInquiry = useCallback(
    (product: Product) => {
      if (!business.phone) {
        toast({
          title: "Contact Unavailable",
          description: "Phone number not available",
          variant: "destructive",
        });
        return;
      }

      const productLink = getProductShareUrl({
        businessSlug: business.slug,
        productId: product.id,
      });
      const message = `Hi, I'm interested in ${product.name}\n\n${productLink}`;
      const whatsappUrl = `https://wa.me/${toWhatsappNumber(
        business.phone,
      )}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
    },
    [business.phone, business.slug, toast],
  );

  const handleRelatedProductWhatsappInquiry = useCallback(
    (product: Product, e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (!business.phone) {
        toast({
          title: "Contact Unavailable",
          description: "Phone number not available",
          variant: "destructive",
        });
        return;
      }

      const productLink = getProductShareUrl({
        businessSlug: business.slug,
        productId: product.id,
      });
      const message = `${product.name}\n\nDescription: ${product.description}\n\nLink: ${productLink}`;
      const whatsappUrl = `https://wa.me/${toWhatsappNumber(
        business.phone,
      )}?text=${encodeURIComponent(message)}`;

      try {
        window.open(whatsappUrl, "_blank");
      } catch (error) {
        toast({
          title: "Unable to Open WhatsApp",
          description:
            "Please ensure WhatsApp is installed or try on a mobile device.",
          variant: "destructive",
        });
      }
    },
    [business.phone, business.slug, toast],
  );

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

  // Mobile viewport detection with debounce to prevent excessive re-renders
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 250);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timeoutId);
    };
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
  };

  if (isLoading) {
    return <BusinessProfileSkeleton />;
  }

  return (
    // DASHBOARD LAYOUT CONTAINER
    <div
      className="min-h-screen w-full overflow-hidden bg-orange-50 flex flex-col"
      suppressHydrationWarning
    >
      {/* PAGE HEADER */}
      <header className="shrink-0 bg-white shadow-sm border-b z-50 flex">
        <div className="container mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Business Name */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100">
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
              <span className="text-sm md:text-lg font-bold text-gray-900 block max-w-[140px] truncate">
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

            <div className="flex items-center shrink-0 ml-3 md:ml-4">
              <Link href="/" aria-label="Go to home page" className="inline-flex">
                <img
                  src="/logo.png"
                  alt="Mydigisence Logo"
                  className="h-10 w-10 rounded-full object-cover border border-gray-200 bg-white p-1"
                  loading="eager"
                />
              </Link>
            </div>

          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto grid grid-cols-1 md:grid-cols-4 overflow-hidden">
        <aside className="hidden hide-scrollbar md:block md:col-span-1 h-full overflow-y-auto z-20  ">
          <div className="flex flex-col p-4 lg:gap-4 w-full">
            <BusinessInfoCard business={business} />
          </div>
        </aside>
        <main
          ref={mainContentRef}
          className="md:col-span-3 h-full hide-scrollbar overflow-y-auto mb-5 relative scroll-smooth min-w-0"
        >
          <div className="max-w-auto mx-auto px-2 sm:px-4 lg:px-4 pt-4 space-y-6 lg:space-y-8">
            <BusinessHeroSection
              heroContent={heroContent}
              safeSlides={safeSlides}
              currentSlideIndex={currentSlideIndex}
              setCurrentSlideIndex={setCurrentSlideIndex}
            />

            {/* Mobile View: Business Profile Card - Show after banner */}
            <div className="md:hidden mt-6 mb-8">
              <BusinessInfoCard business={business} />
            </div>

            <BusinessBrandsSection
              brands={safeBrands}
              viewAllBrands={viewAllBrands}
              setViewAllBrands={setViewAllBrands}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              sectionRef={brandsRef}
            />

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
                      onClick={() => {
                        const next = !viewAllProducts;
                        setViewAllProducts(next);
                        if (next) {
                          // Show all products by default when enabling "View All"
                          setVisibleProductsCount(filteredProducts.length);
                          scrollToSection(productsRef as React.RefObject<HTMLDivElement>, "products");
                        } else {
                          // When switching back to carousel, scroll to top
                          scrollToSection(productsRef as React.RefObject<HTMLDivElement>, "home");
                        }
                      }}
                      className=" border-gray-300"
                    >
                      {viewAllProducts ? "Show Less" : "View All"}
                    </Button>
                  </div>

                  {/* Sticky Search Bar */}
                  <div className="sticky top-0 z-30 mb-6">
                    {mounted && (
                      <div
                        className="flex flex-row gap-0 py-2 backdrop-blur-lg"
                        suppressHydrationWarning
                      >
                        <div className="relative flex-1 min-w-0">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 bg-white border-gray-200 focus-visible:ring-orange-500 text-sm rounded-r-none"
                          />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="h-10 shrink-0 bg-white border-gray-200 text-sm gap-2 px-3 rounded-l-none"
                            >
                              <Filter className="h-4 w-4" />
                              <span className="max-w-[80px] truncate">{selectedCategoryLabel}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
                              All
                            </DropdownMenuItem>
                            {categories.map((cat) => (
                              <DropdownMenuItem
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                              >
                                {cat.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>

                  {viewAllProducts ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {visibleFilteredProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onOpenProduct={openProductModal}
                            onShare={handleShare}
                            onInquire={handleProductWhatsappInquiry}
                          />
                        ))}
                      </div>

                      {visibleProductsCount < filteredProducts.length && (
                        <div
                          ref={loadMoreTriggerRef}
                          className="h-10 w-full mt-4"
                          aria-hidden
                        />
                      )}

                    </>
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
                            className="basis-full md:basis-1/3 lg:basis-1/4 pl-4 md:pl-4"
                          >
                            <ProductCard
                              product={product}
                              onOpenProduct={openProductModal}
                              onShare={handleShare}
                              onInquire={handleProductWhatsappInquiry}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {/* Carousel Navigation */}
                      <div className="hidden md:flex justify-end gap-2 mt-4">
                        <CarouselPrevious className="static w-10 h-10 rounded-full border-gray-200 hover:bg-gray-100" />
                        <CarouselNext className="static w-10 h-10 rounded-full border-gray-200 hover:bg-gray-100" />
                      </div>
                    </Carousel>
                  )}
                </div>
              </section>
            )}

            <BusinessPortfolioSection
              images={safePortfolioImages}
              sectionRef={portfolioRef}
            />

          
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

      <BusinessInquiryModal
        open={inquiryModal}
        onOpenChange={setInquiryModal}
        selectedProduct={selectedProduct}
        inquiryData={inquiryData}
        setInquiryData={setInquiryData}
        isSubmitting={isSubmitting}
        onSubmit={handleInquiry}
      />

      <BusinessProductModal
        open={productModal}
        onOpenChange={setProductModal}
        selectedProduct={selectedProductModal}
        relatedProducts={relatedProducts}
        onSelectRelatedProduct={setSelectedProductModal}
        onInquireRelatedProduct={handleRelatedProductWhatsappInquiry}
      />
    </div>
  );
}

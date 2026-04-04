"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getOptimizedImageUrl, handleImageError } from "@/lib/image-utils";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UnifiedModal } from "@/components/ui/UnifiedModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Edit,
  Trash2,
  Save,
  Eye,
  Package,
  BarChart3,
  Building,
  FileText,
  Mail,
  Phone,
  Calendar,
  Image as ImageIcon,
  X,
  Plus,
  Settings,
  Palette,
  ChevronDown,
  ChevronUp,
  User,
  Pause,
  CheckCircle,
  Home,
  Grid3X3,
  Share2,
  Briefcase,
  ExternalLink,
  AlertTriangle,
  FolderTree,
  Globe,
  Type,
  DollarSign,
} from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

import HeroBannerManager from "@/components/ui/hero-banner-manager";
import BusinessBannerUploader from "@/components/ui/business-banner-uploader";
import { BusinessInfoCard } from "../components/BusinessInfoCard";
import SharedSidebar from "../../components/SharedSidebar";
import SharedDashboardHeader from "../../components/SharedDashboardHeader";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  image: string | null;
  inStock: boolean;
  isActive: boolean;
  additionalInfo?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
  categoryId: string | null;
  brandName: string | null;
  category?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
  };
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminId: string;
  categoryId: string | null;
  heroContent: any;
  brandContent: any;
  portfolioContent: any;
  additionalContent: any;
  admin: {
    name?: string | null;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
  products: Product[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
  };
  children?: {
    id: string;
    name: string;
  }[];
  _count?: {
    products: number;
  };
}

export default function BusinessAdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<any>("dashboard");

  // Dialog states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);

  // Individual delete dialog states
  const [showDeleteProductDialog, setShowDeleteProductDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showDeleteBrandDialog, setShowDeleteBrandDialog] = useState(false);
  const [brandToDeleteIndex, setBrandToDeleteIndex] = useState<number | null>(null);
  const [brandToDeleteName, setBrandToDeleteName] = useState<string>("");
  const [showDeletePortfolioDialog, setShowDeletePortfolioDialog] = useState(false);
  const [portfolioToDeleteIndex, setPortfolioToDeleteIndex] = useState<number | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showBulkActivateDialog, setShowBulkActivateDialog] = useState(false);
  const [showBulkDeactivateDialog, setShowBulkDeactivateDialog] = useState(false);

  // Form states
  const [productFormData, setProductFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    brandName: "",
    additionalInfo: {} as Record<string, string>,
    inStock: true,
    isActive: true,
  });
  const [businessInfoFormData, setBusinessInfoFormData] = useState<{
    name: string;
    description: string;
    about: string;
    logo: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    ownerName: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    catalogPdf: string;
    openingHours: { day: string; open: string; close: string }[];
    gstNumber: string;
  }>({
    name: "",
    description: "",
    about: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    ownerName: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    catalogPdf: "",
    openingHours: [],
    gstNumber: "",
  });
  const [brandContent, setBrandContent] = useState<any>({ brands: [] });
  const [portfolioContent, setPortfolioContent] = useState<any>({ images: [] });
  const [footerContent, setFooterContent] = useState<any>({});
  const [heroContent, setHeroContent] = useState<any>({
    slides: [],
    autoPlay: true,
    transitionSpeed: 5,
  });
  const [sectionTitles, setSectionTitles] = useState({
    full: "Full Preview",
    hero: "Hero",
    info: "Business Info",
    brands: "Brand Slider",
    categories: "Categories",
    portfolio: "Portfolio",
    footer: "Footer",
  });
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"content" | "style" | "settings">(
    "content",
  );
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [newInfoKey, setNewInfoKey] = useState("");
  const [newInfoValue, setNewInfoValue] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [updatingInquiry, setUpdatingInquiry] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Pagination state for products
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [productItemsPerPage, setProductItemsPerPage] = useState(10);

  // Categories management state
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    parentId: "",
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Right panel state (for legacy support, now uses UnifiedModal)
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [selectedProfileSection, setSelectedProfileSection] = useState<
    string | null
  >(null);

  // Mobile responsiveness states
  const [isMobile, setIsMobile] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalInquiries: 0,
    newInquiries: 0,
    readInquiries: 0,
    repliedInquiries: 0,
  });

  useEffect(() => {
    // Check if mobile on initial load and on resize
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    console.log("[DEBUG] Business Dashboard - Auth Check:", {
      loading,
      user: user ? { id: user.id, role: user.role, email: user.email } : null,
      currentPath: window.location.pathname,
    });
    if (!loading && (!user || user.role !== "BUSINESS_ADMIN")) {
      console.log("[DEBUG] Business Dashboard - Redirecting to login:", {
        reason: !user ? "No user" : `Wrong role: ${user.role}`,
        redirectingTo: "/login",
      });
      router.push("/login");
      return;
    }

    if (user?.role === "BUSINESS_ADMIN") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Use temporary arrays for stats calculation
      let tempProducts: Product[] = [];
      let tempInquiries: Inquiry[] = [];

      // Fetch business data
      try {
        const businessRes = await fetch("/api/business");
        if (businessRes.ok) {
          const data = await businessRes.json();
          setBusiness(data.business);
          setBrandContent(data.business.brandContent || { brands: [] });
          setPortfolioContent(data.business.portfolioContent || { images: [] });
          setFooterContent(data.business.footerContent || {});
          setHeroContent(
            data.business.heroContent || {
              slides: [],
              autoPlay: true,
              transitionSpeed: 5,
            },
          );
          setBusinessInfoFormData({
            name: data.business.name || "",
            description: data.business.description || "",
            about: data.business.about || "",
            logo: data.business.logo || "",
            address: data.business.address || "",
            // Ensure logo is properly set in form data
            ...(data.business.logo && { logo: data.business.logo }),
            phone: data.business.phone || "",
            email: data.business.email || "",
            website: data.business.website || "",
            ownerName: data.business.admin?.name || "",
            facebook: data.business.facebook || "",
            twitter: data.business.twitter || "",
            instagram: data.business.instagram || "",
            linkedin: data.business.linkedin || "",
            catalogPdf: data.business.catalogPdf || "",
            openingHours: data.business.openingHours || [],
            gstNumber: data.business.gstNumber || "",
          });
        } else {
          const errorData = await businessRes.json();
          toast({
            title: "Error",
            description: `Failed to load business data: ${errorData.error}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Business data fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load business data. Please refresh the page.",
          variant: "destructive",
        });
      }

      // Fetch categories
      try {
        const categoriesRes = await fetch("/api/business/categories");
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories);
        } else {
          console.warn("Failed to fetch categories");
          setCategories([]);
        }
      } catch (error) {
        console.error("Categories fetch error:", error);
        setCategories([]);
      }

      // Fetch products
      try {
        const productsRes = await fetch("/api/business/products");
        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.products);
          setImages([
            ...new Set(data.products.map((p: Product) => p.image).filter(Boolean)),
          ] as string[]);
          tempProducts = data.products;
        } else {
          const errorData = await productsRes.json();
          console.warn("Products fetch failed:", errorData.error);
          setProducts([]);
          setImages([]);
          tempProducts = [];
          toast({
            title: "Warning",
            description: "Failed to load products data.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Products fetch error:", error);
        setProducts([]);
        setImages([]);
        tempProducts = [];
        toast({
          title: "Error",
          description: "Failed to load products. Please check your connection.",
          variant: "destructive",
        });
      }

      // Fetch inquiries
      try {
        const inquiriesRes = await fetch("/api/business/inquiries");
        if (inquiriesRes.ok) {
          const data = await inquiriesRes.json();
          setInquiries(data.inquiries);
          tempInquiries = data.inquiries;
        } else {
          const errorData = await inquiriesRes.json();
          console.warn("Inquiries fetch failed:", errorData.error);
          setInquiries([]);
          tempInquiries = [];
          toast({
            title: "Warning",
            description: "Failed to load inquiries data.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Inquiries fetch error:", error);
        setInquiries([]);
        tempInquiries = [];
        toast({
          title: "Error",
          description:
            "Failed to load inquiries. Please check your connection.",
          variant: "destructive",
        });
      }

      // Calculate stats after fetching all data, use locally fetched data
      setTimeout(() => {
        const totalProducts = tempProducts.length;
        const activeProducts = tempProducts.filter((p) => p.isActive).length;
        const totalInquiries = tempInquiries.length;
        const newInquiriesCt = tempInquiries.filter(
          (i) => i.status === "NEW",
        ).length;
        const readInquiriesCt = tempInquiries.filter(
          (i) => i.status === "READ",
        ).length;
        const repliedInquiriesCt = tempInquiries.filter(
          (i) => i.status === "REPLIED",
        ).length;

        setStats({
          totalProducts,
          activeProducts,
          totalInquiries,
          newInquiries: newInquiriesCt,
          readInquiries: readInquiriesCt,
          repliedInquiries: repliedInquiriesCt,
        });
      }, 100);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description:
          "An unexpected error occurred while loading data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
      categoryId: product.categoryId || "",
      brandName: product.brandName || "",
      additionalInfo: product.additionalInfo || {},
      inStock: product.inStock,
      isActive: product.isActive,
    });
  };

  const handleProductDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteProductDialog(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeletingProduct(productToDelete.id);
    try {
      const response = await fetch(`/api/business/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setStats((prev) => ({
          ...prev,
          totalProducts: prev.totalProducts - 1,
          activeProducts: productToDelete.isActive
            ? prev.activeProducts - 1
            : prev.activeProducts,
        }));
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
        setShowDeleteProductDialog(false);
        setProductToDelete(null);
      } else {
        const errorResult = await response.json();
        toast({
          title: "Error",
          description: `Failed to delete product: ${errorResult.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingProduct(null);
    }
  };

  const handleInquiryStatusUpdate = async (
    inquiryId: string,
    newStatus: string,
  ) => {
    setUpdatingInquiry(inquiryId);
    try {
      const response = await fetch(`/api/business/inquiries/${inquiryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === inquiryId ? { ...i, status: newStatus as any } : i,
          ),
        );
        toast({
          title: "Success",
          description: "Inquiry status updated successfully!",
        });
      } else {
        const errorResult = await response.json();
        toast({
          title: "Error",
          description: `Failed to update status: ${errorResult.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inquiry status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingInquiry(null);
    }
  };

  const handleShare = (product: Product) => {
    const shareUrl = `${window.location.origin}/catalog/${business?.slug}?product=${product.id}&modal=open`;
    const shareData = {
      title: product.name,
      text: `Check out this product: ${product.name}\n\n Description: ${product.description}`,
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
  };

  const handleAddInfo = () => {
    const key = newInfoKey.trim();
    const value = newInfoValue.trim();
    if (!key || !value) return;

    const normalizedKey = key.toLowerCase();
    const currentInfo = productFormData.additionalInfo || {};

    if (currentInfo[normalizedKey]) {
      toast({
        title: "Error",
        description: "This key already exists",
        variant: "destructive",
      });
      return;
    }

    setProductFormData((prev) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [key]: value,
      },
    }));
    setNewInfoKey("");
    setNewInfoValue("");
  };

  const handleRemoveInfo = (keyToRemove: string) => {
    setProductFormData((prev) => {
      const newInfo = { ...prev.additionalInfo };
      delete newInfo[keyToRemove];
      return {
        ...prev,
        additionalInfo: newInfo,
      };
    });
  };

  const handleBasicInfoSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingStates((prev) => ({ ...prev, basicInfo: true }));

    const updateData = {
      name: businessInfoFormData.name,
      description: businessInfoFormData.description,
      about: businessInfoFormData.about,
      logo: businessInfoFormData.logo,
      address: businessInfoFormData.address,
      phone: businessInfoFormData.phone,
      email: businessInfoFormData.email,
      website: businessInfoFormData.website,
      ownerName: businessInfoFormData.ownerName,
      facebook: businessInfoFormData.facebook,
      twitter: businessInfoFormData.twitter,
      instagram: businessInfoFormData.instagram,
      linkedin: businessInfoFormData.linkedin,
      catalogPdf: businessInfoFormData.catalogPdf,
      openingHours: businessInfoFormData.openingHours,
      gstNumber: businessInfoFormData.gstNumber,
    };

    console.log("Frontend updateData being sent:", updateData);
    console.log("Logo URL in updateData:", updateData.logo);

    // Validation
    if (!updateData.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Business name is required.",
        variant: "destructive",
      });
      setSavingStates((prev) => ({ ...prev, basicInfo: false }));
      return;
    }

    if (updateData.name.length < 2) {
      toast({
        title: "Validation Error",
        description: "Business name must be at least 2 characters long.",
        variant: "destructive",
      });
      setSavingStates((prev) => ({ ...prev, basicInfo: false }));
      return;
    }

    if (
      updateData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)
    ) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      setSavingStates((prev) => ({ ...prev, basicInfo: false }));
      return;
    }

    if (
      updateData.website &&
      updateData.website.trim() &&
      !updateData.website.startsWith("http://") &&
      !updateData.website.startsWith("https://")
    ) {
      updateData.website = `https://${updateData.website}`;
    }

    if (
      updateData.logo &&
      updateData.logo.trim() &&
      !updateData.logo.startsWith("http://") &&
      !updateData.logo.startsWith("https://")
    ) {
      updateData.logo = `https://${updateData.logo}`;
    }

    // Social links validation and URL formatting
    const socialFields = ["facebook", "twitter", "instagram", "linkedin"];
    socialFields.forEach((field) => {
      const value = updateData[field as keyof typeof updateData] as string;
      if (value && value.trim()) {
        if (!value.startsWith("http")) {
          (updateData as any)[field] = `https://${value}`;
        }
        // Basic URL validation
        try {
          new URL((updateData as any)[field]);
        } catch {
          toast({
            title: "Validation Error",
            description: `Please enter a valid URL for ${field.charAt(0).toUpperCase() + field.slice(1)}.`,
            variant: "destructive",
          });
          setSavingStates((prev) => ({ ...prev, basicInfo: false }));
          return;
        }
      }
    });

    try {
      const response = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Business update successful. Response:", result);
        console.log("Updated business logo:", result.business.logo);
        setBusiness(result.business);
        toast({
          title: "Success",
          description: "Business information updated successfully!",
        });
      } else {
        const error = await response.json();
        console.error("Business update failed:", error);
        toast({
          title: "Error",
          description: `Failed to update: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Business update error:", error);
      toast({
        title: "Error",
        description:
          "Failed to update business information. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setSavingStates((prev) => ({ ...prev, basicInfo: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || "",
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteCategoryDialog(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const response = await fetch(
        `/api/business/categories?id=${categoryToDelete.id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        await fetchData();
        toast({
          title: "Success",
          description: "Category deleted successfully!",
        });
        setShowDeleteCategoryDialog(false);
        setCategoryToDelete(null);
      } else {
        const errorResult = await response.json();
        toast({
          title: "Error",
          description: `Failed to delete category: ${errorResult.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteBrand = async () => {
    if (brandToDeleteIndex === null) return;
    const updatedBrands = brandContent.brands.filter(
      (brand: any, i: number) => i !== brandToDeleteIndex,
    );

    try {
      const response = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandContent: {
            brands: updatedBrands,
          },
        }),
      });

      if (response.ok) {
        setBrandContent((prev: any) => ({
          ...prev,
          brands: updatedBrands,
        }));
        toast({
          title: "Success",
          description: "Brand deleted successfully!",
        });
        setShowDeleteBrandDialog(false);
        setBrandToDeleteIndex(null);
        setBrandToDeleteName("");
      } else {
        const errorResult = await response.json();
        toast({
          title: "Error",
          description: `Failed to delete brand: ${errorResult.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete brand. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDeletePortfolio = async () => {
    if (portfolioToDeleteIndex === null) return;
    const updatedImages = (portfolioContent.images || []).filter(
      (img: any, i: number) => i !== portfolioToDeleteIndex,
    );

    try {
      const response = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioContent: { images: updatedImages },
        }),
      });

      if (response.ok) {
        setPortfolioContent((prev: any) => ({
          ...prev,
          images: updatedImages,
        }));
        toast({
          title: "Success",
          description: "Portfolio image deleted successfully!",
        });
        setShowDeletePortfolioDialog(false);
        setPortfolioToDeleteIndex(null);
      } else {
        const errorResult = await response.json();
        toast({
          title: "Error",
          description: `Failed to delete portfolio image: ${errorResult.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete portfolio image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmBulkActivate = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`/api/business/products/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isActive: true,
            }),
          }),
        ),
      );
      await fetchData();
      setSelectedProducts([]);
      toast({
        title: "Success",
        description: "Products activated successfully!",
      });
      setShowBulkActivateDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate products",
        variant: "destructive",
      });
    }
  };

  const confirmBulkDeactivate = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`/api/business/products/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              isActive: false,
            }),
          }),
        ),
      );
      await fetchData();
      setSelectedProducts([]);
      toast({
        title: "Success",
        description: "Products deactivated successfully!",
      });
      setShowBulkDeactivateDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate products",
        variant: "destructive",
      });
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`/api/business/products/${id}`, {
            method: "DELETE",
          }),
        ),
      );
      await fetchData();
      setSelectedProducts([]);
      toast({
        title: "Success",
        description: "Products deleted successfully!",
      });
      setShowBulkDeleteDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete products",
        variant: "destructive",
      });
    }
  };

  const renderSkeletonContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className=" mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="bg-white border border-gray-200 shadow-sm rounded-3xl"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-3xl">
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl"
                      >
                        <Skeleton className="h-5 w-5 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-48 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "products":
        return (
          <div className=" mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-6 w-64" />
              </div>
              <Skeleton className="h-10 w-32 rounded-2xl" />
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-1 rounded-2xl" />
              <Skeleton className="h-10 w-48 rounded-2xl" />
            </div>

            <Card className="rounded-3xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto border border-gray-200">
                  <div className="bg-amber-100 p-4">
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="space-y-4 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex space-x-4">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className="h-12 w-12 rounded-2xl" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-8 rounded-xl" />
                          <Skeleton className="h-8 w-8 rounded-xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "inquiries":
        return (
          <div className=" mx-auto">
            <div className="mb-8">
              <Skeleton className="h-8 w-56 mb-2" />
              <Skeleton className="h-6 w-72" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="bg-white border border-gray-200 shadow-sm rounded-3xl"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card
                  key={i}
                  className="border-l-4 border-l-blue-500 rounded-3xl"
                >
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full mb-4" />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Skeleton className="h-8 w-24 rounded-xl" />
                      <Skeleton className="h-8 w-28 rounded-xl" />
                      <Skeleton className="h-8 w-20 rounded-xl" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className=" mx-auto">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        );
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <div className="fixed inset-0  bg-slate-200  bg-center blur-lg  -z-10"></div>
        {/* Top Header Bar */}
        <div className="bg-white border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-4 sm:px-6 py-2">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-2xl">
                <Skeleton className="h-8 w-8" />
              </div>
              <div>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Skeleton className="h-8 w-24 rounded-2xl hidden sm:flex" />
              <Skeleton className="h-8 w-20 rounded-2xl hidden sm:flex" />
              <Skeleton className="h-8 w-20 rounded-2xl hidden sm:flex" />
              <div className="text-right hidden sm:block">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-8 sm:h-12 sm:w-12 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-1 h-fit overflow-hidden">
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="w-64  bg-white border-r border-gray-200 flex flex-col shadow-sm">
              <div className="p-4 border-b border-gray-200 rounded-t-3xl">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i}>
                      <div className="w-full flex items-center space-x-3 px-3 py-2 rounded-2xl">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t border-gray-200 mb-5 mt-auto">
                <div className="w-full flex items-center space-x-3 px-3 py-2 rounded-2xl">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          )}

          {/* Middle Content */}
          <div
            className={`flex-1  bg-white/50 backdrop-blur-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out pb-20 md:pb-0`}
          >
            <div className="flex-1 p-4 max-w-7xl mx-auto sm:p-6 overflow-auto hide-scrollbar">
              {renderSkeletonContent()}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-gray-200 z-40">
            <div className="flex justify-around items-center py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-2 px-3 rounded-xl"
                >
                  <Skeleton className="h-5 w-5 mb-1" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!user || user.role !== "BUSINESS_ADMIN" || !business) {
    return null;
  }

  const heroSlides = business.heroContent?.slides || [];

  // Menu items for navigation
  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      mobileIcon: Home,
      value: "dashboard",
      mobileTitle: "Home",
    },
    {
      title: "Business Info",
      icon: Building,
      mobileIcon: Building,
      value: "info",
      mobileTitle: "Info",
    },
    {
      title: "Hero Banner",
      icon: ImageIcon,
      mobileIcon: ImageIcon,
      value: "hero",
      mobileTitle: "Hero",
    },
    {
      title: "Brand Slider",
      icon: Palette,
      mobileIcon: Palette,
      value: "brands",
      mobileTitle: "Brands",
    },
    {
      title: "Portfolio",
      icon: Briefcase,
      mobileIcon: Briefcase,
      value: "portfolio",
      mobileTitle: "Portfolio",
    },
    {
      title: "Category",
      icon: Grid3X3,
      mobileIcon: Grid3X3,
      value: "categories",
      mobileTitle: "Category",
    },
    {
      title: "Products",
      icon: Package,
      mobileIcon: Grid3X3,
      value: "products",
      mobileTitle: "Products",
    },
  ];

  const getBusinessSearchPlaceholder = () => {
    switch (activeSection) {
      case "products":
        return "Search products and services...";
      case "inquiries":
        return "Search customer inquiries...";
      case "categories":
        return "Search categories...";
      case "brands":
        return "Search brands...";
      case "portfolio":
        return "Search portfolio items...";
      default:
        return "Search business dashboard...";
    }
  };

  return (
    <div className="min-h-screen flex h-screen  relative">
      <div className="fixed inset-0  bg-slate-200  bg-center blur-lg  -z-10"></div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Desktop / Mobile Bottom Nav */}
        <SharedSidebar
          navLinks={menuItems}
          currentView={activeSection}
          onViewChange={setActiveSection}
          onLogout={async () => {
            await logout();
            router.push("/login");
          }}
          onSettings={() => setActiveSection("settings")}
          onCollapsedChange={setSidebarCollapsed}
          isMobile={isMobile}
          headerTitle={business?.name || "Business Admin"}
          headerIcon={Building}
        />

        {/* Middle Content with Header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <SharedDashboardHeader
            title={business?.name || "Business Admin"}
            userName={user?.name || "Business Admin"}
            userEmail={user?.email}
            searchValue={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setProductCurrentPage(1);
            }}
            searchPlaceholder={getBusinessSearchPlaceholder()}
            rightActions={
              <>
                <div className="hidden md:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      business?.slug && window.open(`/catalog/${business.slug}`, "_blank")
                    }
                    className="rounded-full px-4 py-0.2  bg-slate-900 hover:bg-slate-800  text-white hover:text-white  border-0 hover:opacity-90 transition-opacity"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
                <div className="flex md:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      business?.slug && window.open(`/catalog/${business.slug}`, "_blank")
                    }
                    className="rounded-full px-3 py-0  bg-slate-800  text-white border-0 hover:text-white hover:opacity-90 transition-opacity"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">View</span>
                  </Button>
                </div>
              </>
            }
            avatar={
              business?.logo ? (
                <img
                  src={getOptimizedImageUrl(business.logo, {
                    width: 24,
                    height: 24,
                    quality: 85,
                    format: "auto",
                  })}
                  alt={`${business.name} logo`}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200"
                  onError={handleImageError}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              )
            }
          />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
            <div className="p-4 max-w-7xl mx-auto sm:p-6">
              {/* Main Content based on activeSection */}
              {activeSection === "dashboard" && (
                <>
                  {/* Stats Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900">
                          Total Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.totalProducts}
                        </div>
                        <p className="text-xs text-gray-500">
                          {stats.activeProducts} active
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900">
                          Total Inquiries
                        </CardTitle>
                        <Mail className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.totalInquiries}
                        </div>
                        <p className="text-xs text-gray-500">
                          {stats.newInquiries} new
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900">
                          Profile Completion
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {business
                            ? (() => {
                                const keys = [
                                  business.name ? 25 : 0,
                                  business.description ? 25 : 0,
                                  business.logo ? 25 : 0,
                                  business.address ? 25 : 0,
                                  business.phone ? 25 : 0,
                                  business.email != null ? 25 : 0,
                                  business.website ? 25 : 0,
                                  heroSlides && heroSlides.length > 0 ? 25 : 0,
                                ];
                                let percent = keys.reduce(
                                  (sum, val) => sum + val,
                                  0,
                                );
                                // prevent >100%
                                percent = Math.min(percent, 100);
                                return percent + "%";
                              })()
                            : "0%"}
                        </div>
                        <p className="text-xs text-gray-500">
                          Profile completion
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-900">
                          Business Health
                        </CardTitle>
                        <Building className="h-4 w-4 text-gray-400" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                          {business.isActive ? "Active" : "Inactive"}
                        </div>
                        <p className="text-xs text-gray-500">Status</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Actions and Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                          Common tasks to get you started
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          variant="default"
                          onClick={() => {
                            setActiveSection("products");
                            setEditingProduct(null);
                            setProductFormData({
                              name: "",
                              description: "",
                              price: "",
                              image: "",
                              categoryId: "",
                              brandName: "",
                              additionalInfo: {},
                              inStock: true,
                              isActive: true,
                            });
                            setShowProductDialog(true);
                          }}
                          className="rounded-xl  text-white hover:opacity-90 transition-opacity"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Product
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveSection("info")}
                          className="w-full justify-start rounded-2xl"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Update Business Profile
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveSection("inquiries")}
                          className="w-full justify-start rounded-2xl"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Check New Inquiries
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                          Latest updates and interactions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {inquiries.slice(0, 3).map((inquiry) => (
                            <div
                              key={inquiry.id}
                              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl"
                            >
                              <div className="shrink-0">
                                <Mail className="h-5 w-5 text-blue-500" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  New inquiry from {inquiry.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {formatDate(inquiry.createdAt)}
                                </p>
                              </div>
                              {/* Custom Status Badge with Indicator Dot */}
                              <div
                                className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                                  inquiry.status === "NEW"
                                    ? "bg-red-500/10 border-red-500/30 text-red-600"
                                    : inquiry.status === "READ"
                                      ? "bg-blue-500/10 border-blue-500/30 text-blue-700"
                                      : inquiry.status === "REPLIED"
                                        ? "bg-green-500/10 border-green-500/30 text-green-700"
                                        : "bg-gray-500/10 border-gray-500/30 text-gray-600"
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    inquiry.status === "NEW"
                                      ? "bg-red-500"
                                      : inquiry.status === "READ"
                                        ? "bg-blue-500"
                                        : inquiry.status === "REPLIED"
                                          ? "bg-green-500"
                                          : "bg-gray-500"
                                  }`}
                                ></span>
                                {inquiry.status === "NEW"
                                  ? "New"
                                  : inquiry.status === "READ"
                                    ? "Read"
                                    : inquiry.status === "REPLIED"
                                      ? "Replied"
                                      : "Closed"}
                              </div>
                            </div>
                          ))}
                          {inquiries.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No recent activity
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {activeSection === "info" && (
                <div className=" mx-auto">
                  <div className="mb-6">
                    <h1 className="text-lg font-bold text-gray-900">
                      Business Info
                    </h1>
                    <p className="text-md text-gray-600">
                      Manage your business information
                    </p>
                  </div>

                  {/* Business Info Card */}
                  <div className="mb-8">
                    <BusinessInfoCard
                      businessName={
                        businessInfoFormData.name || "Your Business"
                      }
                      adminName={
                        businessInfoFormData.ownerName || user?.name || "Admin"
                      }
                      description={
                        businessInfoFormData.description ||
                        "Add your business description"
                      }
                      logoUrl={businessInfoFormData.logo}
                      onEdit={() => {
                        // Force refresh when edit state changes
                        setBusinessInfoFormData((prev) => ({ ...prev }));
                      }}
                      onLogoUpload={(url) => {
                        setBusinessInfoFormData((prev) => ({
                          ...prev,
                          logo: url,
                        }));
                      }}
                      gstNumber={businessInfoFormData.gstNumber}
                      openingHours={businessInfoFormData.openingHours}
                      address={businessInfoFormData.address}
                      mobile={businessInfoFormData.phone}
                      email={businessInfoFormData.email}
                      socialLinks={{
                        facebook: businessInfoFormData.facebook,
                        twitter: businessInfoFormData.twitter,
                        instagram: businessInfoFormData.instagram,
                        linkedin: businessInfoFormData.linkedin,
                      }}
                    />
                  </div>
                </div>
              )}

              {activeSection === "hero" && (
                <div className=" mx-auto">
                  <div className="mb-6">
                    <h1 className="text-lg font-bold text-gray-900">
                      Hero Banner
                    </h1>
                    <p className="text-md text-gray-600">
                      Manage your hero section
                    </p>
                  </div>


                  {/* Hero Banner Manager - Advanced Multiple Slides */}
                  <Card className="rounded-3xl p-0 shadow-none bg-transparent">
                    <CardContent className="p-0" >
                      <HeroBannerManager
                        heroContent={heroContent}
                        onChange={async (newContent) => {
                          setHeroContent(newContent);
                          if (!business) return;
                          try {
                            const response = await fetch("/api/business", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ heroContent: newContent }),
                            });
                            if (response.ok) {
                              const result = await response.json();
                              setBusiness(result.business);
                              toast({
                                title: "Success",
                                description: "Hero content saved successfully!",
                              });
                            } else {
                              toast({
                                title: "Error",
                                description: "Failed to save hero content",
                                variant: "destructive",
                              });
                            }
                          } catch (error) {
                            toast({
                              title: "Error",
                              description: "Failed to save hero content",
                              variant: "destructive",
                            });
                          }
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "brands" && (
                <div className=" mx-auto">
                  <div className="mb-6">
                    <h1 className="text-lg font-bold text-gray-900">
                      Brand Slider
                    </h1>
                    <p className="text-md text-gray-600">
                      Manage your brand slider
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Section Title */}
                    <div>
                      <Label className="text-sm font-medium">
                        Page Title for Brand Section
                      </Label>
                      <Input
                        value={sectionTitles.brands}
                        onChange={(e) =>
                          setSectionTitles((prev) => ({
                            ...prev,
                            brands: e.target.value,
                          }))
                        }
                        placeholder="Enter section title"
                        className="rounded-2xl bg-white"
                      />
                    </div>

                    {/* Add New Brand Section */}
                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">Add New Brand</CardTitle>
                        <CardDescription>
                          Add a new brand to your brand slider
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Brand Name</Label>
                          <Input
                            placeholder="Enter brand name"
                            value={brandContent.newBrandName || ""}
                            onChange={(e) =>
                              setBrandContent((prev: any) => ({
                                ...prev,
                                newBrandName: e.target.value,
                              }))
                            }
                            className="bg-white rounded-2xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Brand Photo</Label>
                          <div className="space-y-2">
                            <Input
                              placeholder="Photo URL or upload below"
                              value={brandContent.newBrandLogo || ""}
                              onChange={(e) =>
                                setBrandContent((prev: any) => ({
                                  ...prev,
                                  newBrandLogo: e.target.value,
                                }))
                              }
                              className="bg-white rounded-2xl"
                            />
                            <ImageUpload
                              onUpload={(url) =>
                                setBrandContent((prev: any) => ({
                                  ...prev,
                                  newBrandLogo: url,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <Button
                          onClick={async () => {
                            if (!brandContent.newBrandName?.trim()) {
                              toast({
                                title: "Error",
                                description: "Please enter a brand name",
                                variant: "destructive",
                              });
                              return;
                            }

                            setSavingBrand(true);
                            const newBrand = {
                              name: brandContent.newBrandName.trim(),
                              logo: brandContent.newBrandLogo || "",
                            };

                            const updatedBrands = [
                              ...(brandContent.brands || []),
                              newBrand,
                            ];

                            try {
                              const response = await fetch("/api/business", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  brandContent: { brands: updatedBrands },
                                }),
                              });

                              if (response.ok) {
                                setBrandContent((prev: any) => ({
                                  ...prev,
                                  brands: updatedBrands,
                                  newBrandName: "",
                                  newBrandLogo: "",
                                }));
                                toast({
                                  title: "Success",
                                  description: "Brand added successfully!",
                                });
                              } else {
                                const errorResult = await response.json();
                                toast({
                                  title: "Error",
                                  description: `Failed to add brand: ${errorResult.error}`,
                                  variant: "destructive",
                                });
                              }
                            } catch (error) {
                              toast({
                                title: "Error",
                                description:
                                  "Failed to add brand. Please try again.",
                                variant: "destructive",
                              });
                            } finally {
                              setSavingBrand(false);
                            }
                          }}
                          disabled={savingBrand}
                          className="w-full rounded-2xl"
                        >
                          {savingBrand ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Brand
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Brands Table Section */}
                    <Card className="p-0 overflow-hidden rounded-xl">
                      <CardContent className="p-0">
                        {brandContent.brands?.length > 0 ? (
                          <Table>
                            <TableHeader className="bg-[#080322] ">
                              <TableRow>
                                <TableHead className="text-white font-medium">
                                  Brand Name
                                </TableHead>
                                <TableHead className="text-white font-medium">
                                  Logo
                                </TableHead>
                                <TableHead className="w-32 text-white font-medium">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {brandContent.brands.map(
                                (brand: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">
                                      {brand.name}
                                    </TableCell>
                                    <TableCell>
                                      {brand.logo ? (
                                        <img
                                          src={getOptimizedImageUrl(
                                            brand.logo,
                                            {
                                              width: 32,
                                              height: 32,
                                              quality: 85,
                                              format: "auto",
                                            },
                                          )}
                                          alt={brand.name}
                                          className="h-8 w-8 object-cover rounded-2xl"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <div className="h-8 w-8 bg-gray-200 rounded-2xl flex items-center justify-center">
                                          <ImageIcon className="h-4 w-4 text-gray-400" />
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={async () => {
                                            const newName = prompt(
                                              "Edit brand name:",
                                              brand.name,
                                            );
                                            if (newName && newName.trim()) {
                                              const updatedBrands = [
                                                ...brandContent.brands,
                                              ];
                                              updatedBrands[index] = {
                                                ...brand,
                                                name: newName.trim(),
                                              };

                                              try {
                                                const response = await fetch(
                                                  "/api/business",
                                                  {
                                                    method: "PUT",
                                                    headers: {
                                                      "Content-Type":
                                                        "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                      brandContent: {
                                                        brands: updatedBrands,
                                                      },
                                                    }),
                                                  },
                                                );

                                                if (response.ok) {
                                                  setBrandContent((prev: any) => ({
                                                    ...prev,
                                                    brands: updatedBrands,
                                                  }));
                                                  toast({
                                                    title: "Success",
                                                    description:
                                                      "Brand updated successfully!",
                                                  });
                                                } else {
                                                  const errorResult =
                                                    await response.json();
                                                  toast({
                                                    title: "Error",
                                                    description: `Failed to update brand: ${errorResult.error}`,
                                                    variant: "destructive",
                                                  });
                                                }
                                              } catch (error) {
                                                toast({
                                                  title: "Error",
                                                  description:
                                                    "Failed to update brand. Please try again.",
                                                  variant: "destructive",
                                                });
                                              }
                                            }
                                          }}
                                          className="rounded-xl"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => {
                                            setBrandToDeleteIndex(index);
                                            setBrandToDeleteName(brand.name);
                                            setShowDeleteBrandDialog(true);
                                          }}
                                          className="rounded-xl"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8">
                            <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No brands to manage
                            </h3>
                            <p className="text-gray-600">
                              Add brands using the editor panel
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeSection === "portfolio" && (
                <div className=" mx-auto">
                  <div className="mb-6">
                    <h1 className="text-lg font-bold text-gray-900">
                      Portfolio Manager
                    </h1>
                    <p className="text-md text-gray-600">
                      Manage your portfolio images
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Section Title */}
                    <div>
                      <Label className="text-sm font-medium">
                        Page Title for Portfolio Section
                      </Label>
                      <Input
                        value={sectionTitles.portfolio}
                        onChange={(e) =>
                          setSectionTitles((prev) => ({
                            ...prev,
                            portfolio: e.target.value,
                          }))
                        }
                        placeholder="Enter section title"
                        className="rounded-2xl bg-white"
                      />
                    </div>

                    {/* Portfolio Grid - Bento Layout */}
                    <Card className="rounded-3xl overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Portfolio Grid</CardTitle>
                            <CardDescription>
                              Click empty slots to add, icons to manage.
                            </CardDescription>
                          </div>
                          <div className="text-sm text-gray-500 font-medium">
                            {(portfolioContent.images || []).length}/6 Images
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
                          {Array.from({ length: 6 }).map((_, index) => {
                            const image = (portfolioContent.images || [])[
                              index
                            ];

                            // Grid Positioning Logic
                            const gridClasses = [
                              // --- ROW 1: 2 Rectangles ---
                              "md:row-span-1 md:col-span-2 col-span-2 row-span-2", // Index 0: Rect (Spans full width on mobile, 2 cols on desktop)
                              "md:row-span-1 md:col-span-2 col-span-2 row-span-2", // Index 1: Rect (Spans full width on mobile, 2 cols on desktop)

                              // --- ROW 2: 4 Squares ---
                              "md:row-span-1 md:col-span-1 col-span-1", // Index 2: Square
                              "md:row-span-1 md:col-span-1 col-span-1", // Index 3: Square
                              "md:row-span-1 md:col-span-1 col-span-1", // Index 4: Square
                              "md:row-span-1 md:col-span-1 col-span-1", // Index 5: Square
                            ];

                            // Identify Type
                            // Indices 0 & 1 are Rectangles (16:9)
                            // Indices 2-5 are Squares (1:1)
                            const isRect = index === 0 || index === 1;
                            const isSquare = !isRect;

                            // Aspect Ratio
                            const aspectRatioClass = isRect
                              ? "aspect-video"
                              : "aspect-square";

                            // Square Sizing Logic (To ensure proper shape)
                            // On Desktop (4 cols): Squares are w-1/4 (25%).
                            // On Mobile (2 cols): Squares are w-1/2 (50%).

                            const isVideo =
                              image?.url &&
                              (image.url.includes(".mp4") ||
                                image.url.includes(".webm") ||
                                image.url.includes(".ogg"));

                            const handleImageUpdate = (
                              index: number,
                              url: string,
                            ) => {
                              const updatedImages = [
                                ...(portfolioContent.images || []),
                              ];
                              updatedImages[index] = {
                                url,
                                alt: "Portfolio image",
                              };
                              savePortfolioImages(updatedImages);
                            };

                            const savePortfolioImages = async (
                              images: any[],
                            ) => {
                              try {
                                const response = await fetch("/api/business", {
                                  method: "PUT",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    portfolioContent: { images },
                                  }),
                                });

                                if (response.ok) {
                                  setPortfolioContent((prev: any) => ({
                                    ...prev,
                                    images,
                                  }));
                                  toast({
                                    title: "Success",
                                    description:
                                      "Portfolio updated successfully!",
                                  });
                                } else {
                                  const errorResult = await response.json();
                                  toast({
                                    title: "Error",
                                    description: `Failed to update portfolio: ${errorResult.error}`,
                                    variant: "destructive",
                                  });
                                }
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description:
                                    "Failed to update portfolio. Please try again.",
                                  variant: "destructive",
                                });
                              }
                            };

                            return (
                              <div
                                key={index}
                                className={`
                                        relative bg-gray-100 border-2 border-dashed border-gray-300
                                        rounded-2xl overflow-hidden group transition-all duration-300
                                        ${image ? "border-gray-200 shadow-sm hover:shadow-md" : "hover:border-blue-400 hover:bg-blue-50"}
                                        ${gridClasses[index]}
                                        ${aspectRatioClass}
                                       
                                      `}
                              >
                                {/* Empty Slot: Click to Open File Manager */}
                                {!image && (
                                  <div
                                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
                                    onClick={() => {
                                      const fileInput =
                                        document.createElement("input");
                                      fileInput.type = "file";
                                      fileInput.accept = "image/*,video/*";
                                      fileInput.onchange = (e) => {
                                        const target =
                                          e.target as HTMLInputElement;
                                        if (target.files && target.files[0]) {
                                          const file = target.files[0];
                                          const reader = new FileReader();
                                          reader.onload = (event) => {
                                            const result = event.target?.result;
                                            if (typeof result === "string") {
                                              handleImageUpdate(index, result);
                                            }
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      };
                                      fileInput.click();
                                    }}
                                  >
                                    <div
                                      className={`
                                                flex items-center justify-center rounded-full bg-white shadow-sm mb-3
                                                ${isRect ? "w-16 h-16" : "w-12 h-12"}
                                              `}
                                    >
                                      <Plus
                                        className={`text-gray-400 ${isRect ? "w-8 h-8" : "w-6 h-6"}`}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">
                                      {isRect
                                        ? "Add Rect Image (16:9)"
                                        : "Add Square Image"}
                                    </span>
                                  </div>
                                )}

                                {/* Filled Slot: Image or Video */}
                                {image && (
                                  <>
                                    {/* Media Content */}
                                    <div className="absolute inset-0 bg-gray-200">
                                      {isVideo ? (
                                        <video
                                          src={image.url}
                                          className="w-full h-full object-cover"
                                          muted
                                          loop
                                          playsInline
                                        />
                                      ) : (
                                        <img
                                          src={image.url}
                                          alt={image.alt || "Portfolio image"}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                      )}
                                    </div>

                                    {/* Dark Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20" />

                                    {/* Action Buttons (Edit & Delete) */}
                                    <div className="absolute top-2 right-2 flex space-x-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      {/* Edit Button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const fileInput =
                                            document.createElement("input");
                                          fileInput.type = "file";
                                          fileInput.accept = "image/*,video/*";
                                          fileInput.onchange = (e) => {
                                            const target =
                                              e.target as HTMLInputElement;
                                            if (
                                              target.files &&
                                              target.files[0]
                                            ) {
                                              const file = target.files[0];
                                              const reader = new FileReader();
                                              reader.onload = (event) => {
                                                const result =
                                                  event.target?.result;
                                                if (
                                                  typeof result === "string"
                                                ) {
                                                  handleImageUpdate(
                                                    index,
                                                    result,
                                                  );
                                                }
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          };
                                          fileInput.click();
                                        }}
                                        className="bg-white/90 backdrop-blur text-gray-700 hover:text-blue-600 hover:bg-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                                        title="Edit Image"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </button>

                                      {/* Delete Button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPortfolioToDeleteIndex(index);
                                          setShowDeletePortfolioDialog(true);
                                        }}
                                        className="bg-white/90 backdrop-blur text-gray-700 hover:text-red-600 hover:bg-white p-2 rounded-full shadow-lg transition-transform hover:scale-105"
                                        title="Delete Image"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeSection === "categories" && (
                <div className=" mx-auto">
                  <div className="mb-6">
                    <h1 className="text-lg font-bold text-gray-900">
                      Category Manager
                    </h1>
                    <p className="text-md text-gray-600">
                      Configure business categories and classifications
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Section Title */}
                    <div>
                      <Label className="text-sm font-medium mb-1">
                        Section Title
                      </Label>
                      <Input
                        value={sectionTitles.categories}
                        onChange={(e) =>
                          setSectionTitles((prev) => ({
                            ...prev,
                            categories: e.target.value,
                          }))
                        }
                        placeholder="Enter section title"
                        className="bg-white rounded-2xl"
                      />
                    </div>

                    {/* Add New Category Section */}
                    <Card className="rounded-3xl">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Add New Category
                        </CardTitle>
                        <CardDescription>
                          Add a new category for your products
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Category Name *</Label>
                          <Input
                            placeholder="Enter category name"
                            value={categoryFormData.name}
                            onChange={(e) =>
                              setCategoryFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="bg-white rounded-2xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe this category"
                            value={categoryFormData.description}
                            onChange={(e) =>
                              setCategoryFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            className="bg-white rounded-2xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Parent Category</Label>
                          <Select
                            value={categoryFormData.parentId || "none"}
                            onValueChange={(value) =>
                              setCategoryFormData((prev) => ({
                                ...prev,
                                parentId: value === "none" ? "" : value,
                              }))
                            }
                          >
                            <SelectTrigger className="bg-white rounded-2xl">
                              <SelectValue placeholder="Select parent category (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No parent</SelectItem>
                              {categories
                                .filter((cat) => !cat.parentId)
                                .map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            onClick={async () => {
                              if (!categoryFormData.name.trim()) {
                                toast({
                                  title: "Error",
                                  description: "Category name is required",
                                  variant: "destructive",
                                });
                                return;
                              }

                              setSavingCategory(true);
                              try {
                                const response = await fetch("/api/business/categories", {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(categoryFormData),
                                });

                                if (response.ok) {
                                  const data = await response.json();
                                  setCategories((prev) => [...prev, data.category]);
                                  setCategoryFormData({
                                    name: "",
                                    description: "",
                                    parentId: "",
                                  });
                                  await fetchData();
                                  toast({
                                    title: "Success",
                                    description: "Category created successfully!",
                                  });
                                } else {
                                  const errorResult = await response.json();
                                  toast({
                                    title: "Error",
                                    description: `Failed to create category: ${errorResult.error}`,
                                    variant: "destructive",
                                  });
                                }
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to create category. Please try again.",
                                  variant: "destructive",
                                });
                              } finally {
                                setSavingCategory(false);
                              }
                            }}
                            disabled={savingCategory}
                            className="rounded-xl  hover:opacity-90 transition-opacity"
                          >
                            {savingCategory ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              "Add New Category"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Categories Table Section */}
                    <Card className=" p-0 rounded-xl overflow-hidden">
                      <CardContent className="p-0">
                        {categories.length > 0 ? (
                          <Table>
                            <TableHeader className="bg-[#080322] ">
                              <TableRow>
                                <TableHead className="text-white font-medium">
                                  Category Name
                                </TableHead>
                                <TableHead className="text-white font-medium">
                                  Description
                                </TableHead>
                                <TableHead className="text-white font-medium">
                                  Parent
                                </TableHead>
                                <TableHead className="w-32 text-white font-medium">
                                  Actions
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {categories.map((category) => (
                                <TableRow key={category.id}>
                                  <TableCell className="font-medium">
                                    {category.name}
                                  </TableCell>
                                  <TableCell>
                                    {category.description || "—"}
                                  </TableCell>
                                  <TableCell>
                                    {category.parent
                                      ? category.parent.name
                                      : "—"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingCategory(category);
                                          setCategoryFormData({
                                            name: category.name,
                                            description:
                                              category.description || "",
                                            parentId: category.parentId || "",
                                          });
                                          setShowCategoryModal(true);
                                        }}
                                        className="rounded-xl"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleDeleteCategory(category)
                                        }
                                        className="rounded-xl"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8">
                            <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              No categories yet
                            </h3>
                            <p className="text-gray-600">
                              Add your first category using the form above
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeSection === "products" && (
                <div className=" mx-auto">
                  <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h1 className="text-lg font-bold text-gray-900">
                        Products & Services
                      </h1>
                      <p className="text-md text-gray-600">
                        Manage your product offerings
                      </p>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => {
                        setEditingProduct(null);
                        setProductFormData({
                          name: "",
                          description: "",
                          price: "",
                          image: "",
                          categoryId: "",
                          brandName: "",
                          additionalInfo: {},
                          inStock: true,
                          isActive: true,
                        });
                        setShowProductDialog(true);
                      }}
                      className="rounded-xl  hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>

                  <div className="mb-6 flex justify-end">
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) => {
                        setSelectedCategory(value === "all" ? "" : value);
                        setProductCurrentPage(1); // Reset to first page on filter change
                      }}
                    >
                      <SelectTrigger className="w-full bg-white sm:w-48 rounded-2xl">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Card className="p-0 bg-white rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                      {mounted && selectedProducts.length > 0 && (
                        <div className="p-4 bg-blue-50 border-b border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-blue-900">
                              {selectedProducts.length} product
                              {selectedProducts.length > 1 ? "s" : ""} selected
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowBulkActivateDialog(true)}
                              className="rounded-xl"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Activate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowBulkDeactivateDialog(true)}
                              className="rounded-xl"
                            >
                              <Pause className="h-4 w-4 mr-2" />
                              Deactivate
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowBulkDeleteDialog(true)}
                              className="rounded-xl"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedProducts([])}
                            className="rounded-xl"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="overflow-x-auto border border-gray-200 rounded-md ">
                        <Table>
                          <TableHeader className="bg-[#080322] ">
                            <TableRow>
                              <TableHead className="w-12 text-white font-medium">
                                <Checkbox
                                  checked={
                                    selectedProducts.length ===
                                      products.filter(
                                        (p) =>
                                          p.name
                                            .toLowerCase()
                                            .includes(
                                              searchTerm.toLowerCase(),
                                            ) &&
                                          (selectedCategory === "" ||
                                            p.categoryId === selectedCategory),
                                      ).length && selectedProducts.length > 0
                                  }
                                  onCheckedChange={(checked) => {
                                    const filteredProducts = products.filter(
                                      (p) =>
                                        p.name
                                          .toLowerCase()
                                          .includes(searchTerm.toLowerCase()) &&
                                        (selectedCategory === "" ||
                                          p.categoryId === selectedCategory),
                                    );
                                    if (checked) {
                                      setSelectedProducts(
                                        filteredProducts.map((p) => p.id),
                                      );
                                    } else {
                                      setSelectedProducts([]);
                                    }
                                  }}
                                />
                              </TableHead>
                              <TableHead className="text-white font-medium">
                                Image
                              </TableHead>
                              <TableHead className="text-white font-medium">
                                Name
                              </TableHead>
                              <TableHead className="text-white font-medium">
                                Category
                              </TableHead>
                              <TableHead className="text-white font-medium">
                                Brand
                              </TableHead>
                              <TableHead className="text-white font-medium">
                                Price
                              </TableHead>
                              <TableHead className="text-white font-medium">
                                Status
                              </TableHead>
                              <TableHead className="w-32 text-white font-medium">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(() => {
                              // Filter products based on search and category
                              const filteredProducts = products.filter(
                                (product) =>
                                  product.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()) &&
                                  (selectedCategory === "" ||
                                    product.categoryId === selectedCategory),
                              );
                              
                              // Calculate pagination
                              const totalFilteredProducts = filteredProducts.length;
                              const totalPages = Math.ceil(totalFilteredProducts / productItemsPerPage);
                              const startIndex = (productCurrentPage - 1) * productItemsPerPage;
                              const endIndex = startIndex + productItemsPerPage;
                              const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
                              
                              return paginatedProducts.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedProducts.includes(
                                        product.id,
                                      )}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedProducts((prev) => [
                                            ...prev,
                                            product.id,
                                          ]);
                                        } else {
                                          setSelectedProducts((prev) =>
                                            prev.filter(
                                              (id) => id !== product.id,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {product.image ? (
                                      <img
                                        src={getOptimizedImageUrl(
                                          product.image,
                                          {
                                            width: 50,
                                            height: 50,
                                            quality: 85,
                                            format: "auto",
                                          },
                                        )}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-2xl"
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-gray-200 rounded-2xl flex items-center justify-center">
                                        <ImageIcon className="h-6 w-6 text-gray-400" />
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    {product.name}
                                  </TableCell>
                                  <TableCell>
                                    {product.category ? (
                                      <Badge
                                        variant="secondary"
                                        className="rounded-full"
                                      >
                                        {product.category.name}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {product.brandName ? (
                                      <Badge
                                        variant="outline"
                                        className="rounded-full"
                                      >
                                        {product.brandName}
                                      </Badge>
                                    ) : (
                                      <span className="text-gray-400">—</span>
                                    )}
                                  </TableCell>
                                  <TableCell>{product.price || "—"}</TableCell>
                                  <TableCell>
                                    {/* Custom Stock Status Badge with Indicator Dot */}
                                    <div
                                      className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                                        product.inStock
                                          ? "bg-lime-500/10 border-lime-500/30 text-lime-700"
                                          : "bg-red-500/10 border-red-500/30 text-red-600"
                                      }`}
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full ${
                                          product.inStock
                                            ? "bg-lime-500"
                                            : "bg-red-500"
                                        }`}
                                      ></span>
                                      {product.inStock
                                        ? "In Stock"
                                        : "Out of Stock"}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          handleProductEdit(product);
                                          setShowProductDialog(true);
                                        }}
                                        className="rounded-xl"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleShare(product)}
                                        className="rounded-xl"
                                      >
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          handleProductDelete(product)
                                        }
                                        className="rounded-xl"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ));
                            })()}
                          </TableBody>
                        </Table>
                      </div>
                      {products.length === 0 && (
                        <div className="text-center py-12">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No products yet
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Add your first product or service to get started
                          </p>
                          <Button
                            onClick={() => {
                              setEditingProduct(null);
                              setProductFormData({
                                name: "",
                                description: "",
                                price: "",
                                image: "",
                                categoryId: "",
                                brandName: "",
                                additionalInfo: {},
                                inStock: true,
                                isActive: true,
                              });
                              setShowProductDialog(true);
                            }}
                            className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                          </Button>
                        </div>
                      )}
                      {/* Pagination Component */}
                      {products.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                          <Pagination
                            currentPage={productCurrentPage}
                            totalPages={Math.ceil(
                              products.filter(
                                (p) =>
                                  p.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()) &&
                                  (selectedCategory === "" ||
                                    p.categoryId === selectedCategory),
                              ).length / productItemsPerPage
                            )}
                            totalItems={products.filter(
                              (p) =>
                                p.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) &&
                                (selectedCategory === "" ||
                                  p.categoryId === selectedCategory),
                            ).length}
                            itemsPerPage={productItemsPerPage}
                            onPageChange={setProductCurrentPage}
                            onItemsPerPageChange={(limit) => {
                              setProductItemsPerPage(limit);
                              setProductCurrentPage(1); // Reset to first page when changing items per page
                            }}
                            className="flex-wrap"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "inquiries" && (
                <div className=" mx-auto">
                  <div className="mb-8">
                    <h1 className="text-lg font-bold text-gray-900">
                      Customer Inquiries
                    </h1>
                    <p className="text-md text-gray-600">
                      View and respond to customer inquiries
                    </p>
                  </div>

                  {inquiries.length === 0 ? (
                    <Card className="rounded-3xl">
                      <CardContent className="text-center py-12">
                        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No inquiries yet
                        </h3>
                        <p className="text-gray-600">
                          Customer inquiries will appear here when people
                          contact you
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-900">
                              Total
                            </CardTitle>
                            <Mail className="h-4 w-4 text-gray-400" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                              {stats.totalInquiries}
                            </div>
                            <p className="text-xs text-gray-500">
                              All inquiries
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-900">
                              New
                            </CardTitle>
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                              {stats.newInquiries}
                            </div>
                            <p className="text-xs text-gray-500">
                              Awaiting review
                            </p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-900">
                              Read
                            </CardTitle>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                              {stats.readInquiries}
                            </div>
                            <p className="text-xs text-gray-500">Viewed</p>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-900">
                              Replied
                            </CardTitle>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-gray-900">
                              {stats.repliedInquiries}
                            </div>
                            <p className="text-xs text-gray-500">
                              Response sent
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        {inquiries.slice(0, 10).map((inquiry) => (
                          <Card
                            key={inquiry.id}
                            className="border-l-4 border-l-blue-500 rounded-3xl transition-all duration-300 hover:shadow-lg"
                          >
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <h4 className="font-semibold text-lg">
                                      {inquiry.name}
                                    </h4>
                                    {/* Custom Status Badge with Indicator Dot */}
                                    <div
                                      className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                                        inquiry.status === "NEW"
                                          ? "bg-red-500/10 border-red-500/30 text-red-600"
                                          : inquiry.status === "READ"
                                            ? "bg-blue-500/10 border-blue-500/30 text-blue-700"
                                            : inquiry.status === "REPLIED"
                                              ? "bg-green-500/10 border-green-500/30 text-green-700"
                                              : "bg-gray-500/10 border-gray-500/30 text-gray-600"
                                      }`}
                                    >
                                      <span
                                        className={`w-2 h-2 rounded-full ${
                                          inquiry.status === "NEW"
                                            ? "bg-red-500"
                                            : inquiry.status === "READ"
                                              ? "bg-blue-500"
                                              : inquiry.status === "REPLIED"
                                                ? "bg-green-500"
                                                : "bg-gray-500"
                                        }`}
                                      ></span>
                                      {inquiry.status === "NEW"
                                        ? "New"
                                        : inquiry.status === "READ"
                                          ? "Read"
                                          : inquiry.status === "REPLIED"
                                            ? "Replied"
                                            : "Closed"}
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Mail className="h-4 w-4" />
                                      <a
                                        href={`mailto:${inquiry.email}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        {inquiry.email}
                                      </a>
                                    </div>
                                    {inquiry.phone && (
                                      <div className="flex items-center space-x-1">
                                        <Phone className="h-4 w-4" />
                                        <a
                                          href={`tel:${inquiry.phone}`}
                                          className="text-blue-600 hover:underline"
                                        >
                                          {inquiry.phone}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(inquiry.createdAt)}</span>
                                  </div>
                                </div>
                                {inquiry.product && (
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Package className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      Regarding:{" "}
                                      <strong>{inquiry.product.name}</strong>
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {inquiry.message}
                                </p>
                                <Separator />

                                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                  {inquiry.status === "NEW" && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleInquiryStatusUpdate(
                                          inquiry.id,
                                          "READ",
                                        )
                                      }
                                      className="rounded-xl"
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      Mark as Read
                                    </Button>
                                  )}
                                  {(inquiry.status === "NEW" ||
                                    inquiry.status === "READ") && (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleInquiryStatusUpdate(
                                          inquiry.id,
                                          "REPLIED",
                                        )
                                      }
                                      className="rounded-xl"
                                    >
                                      <Mail className="h-4 w-4 mr-1" />
                                      Mark as Replied
                                    </Button>
                                  )}
                                  {(inquiry.status === "NEW" ||
                                    inquiry.status === "READ" ||
                                    inquiry.status === "REPLIED") && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleInquiryStatusUpdate(
                                          inquiry.id,
                                          "CLOSED",
                                        )
                                      }
                                      className="rounded-xl"
                                    >
                                      <FileText className="h-4 w-4 mr-1" />
                                      Close
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeSection === "analytics" && (
                <div className=" mx-auto">
                  <div className="mb-8">
                    <h1 className="text-lg font-bold text-gray-900">
                      Analytics
                    </h1>
                    <p className="text-md text-gray-600">
                      Track your business performance
                    </p>
                  </div>
                  <Card className="rounded-3xl">
                    <CardContent className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Analytics Coming Soon
                      </h3>
                      <p className="text-gray-600">
                        Detailed analytics and insights will be available here
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "settings" && (
                <div className=" mx-auto">
                  <div className="mb-8">
                    <h1 className="text-lg font-bold text-gray-900">
                      Settings
                    </h1>
                    <p className="text-md text-gray-600">
                      Manage your account and preferences
                    </p>
                  </div>
                  <Card className="rounded-3xl">
                    <CardContent className="text-center py-12">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Settings Coming Soon
                      </h3>
                      <p className="text-gray-600">
                        Account settings and preferences will be available here
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Category Management Modal */}
          <UnifiedModal
            isOpen={showCategoryModal}
            onClose={(open) => {
              if (!open) {
                setShowCategoryModal(false);
                setEditingCategory(null);
                setCategoryFormData({
                  name: "",
                  description: "",
                  parentId: "",
                });
              }
            }}
            title={editingCategory ? "Edit Category" : "Add New Category"}
            description={
              editingCategory
                ? "Update category details"
                : "Create a new category for your products"
            }
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setCategoryFormData({
                      name: "",
                      description: "",
                      parentId: "",
                    });
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!categoryFormData.name.trim()) {
                      toast({
                        title: "Error",
                        description: "Category name is required",
                        variant: "destructive",
                      });
                      return;
                    }

                    setSavingCategory(true);
                    try {
                      const url = editingCategory
                        ? `/api/business/categories?id=${editingCategory.id}`
                        : "/api/business/categories";
                      const method = editingCategory ? "PUT" : "POST";

                      const response = await fetch(url, {
                        method,
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(categoryFormData),
                      });

                      if (response.ok) {
                        const data = await response.json();
                        if (editingCategory) {
                          setCategories((prev) =>
                            prev.map((c) =>
                              c.id === editingCategory.id ? data.category : c,
                            ),
                          );
                        } else {
                          setCategories((prev) => [...prev, data.category]);
                        }
                        setCategoryFormData({
                          name: "",
                          description: "",
                          parentId: "",
                        });
                        setEditingCategory(null);
                        setShowCategoryModal(false);
                        await fetchData();
                        toast({
                          title: "Success",
                          description: editingCategory
                            ? "Category updated successfully!"
                            : "Category created successfully!",
                        });
                      } else {
                        const errorResult = await response.json();
                        toast({
                          title: "Error",
                          description: `Failed to ${editingCategory ? "update" : "create"} category: ${errorResult.error}`,
                          variant: "destructive",
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: `Failed to ${editingCategory ? "update" : "create"} category`,
                        variant: "destructive",
                      });
                    } finally {
                      setSavingCategory(false);
                    }
                  }}
                  disabled={savingCategory}
                  className="rounded-xl"
                >
                  {savingCategory ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Add Category"
                  )}
                </Button>
              </>
            }
          >
            <div className="space-y-6">
              {/* Section Title */}
              <div>
                <Label className="text-sm font-medium">Section Title</Label>
                <div className="relative">
                  <Input
                    value={sectionTitles.categories}
                    onChange={(e) =>
                      setSectionTitles((prev) => ({
                        ...prev,
                        categories: e.target.value,
                      }))
                    }
                    placeholder="Enter section title"
                    className="pl-10 rounded-md"
                  />
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Category Name *</Label>
                <div className="relative">
                  <Input
                    placeholder="Enter category name"
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="pl-10 rounded-md"
                  />
                  <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe this category"
                  value={categoryFormData.description}
                  onChange={(e) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <Select
                  value={categoryFormData.parentId || "none"}
                  onValueChange={(value) =>
                    setCategoryFormData((prev) => ({
                      ...prev,
                      parentId: value === "none" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger className="rounded-md">
                    <SelectValue placeholder="Select parent category (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent</SelectItem>
                    {categories
                      .filter((cat) => !cat.parentId)
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </UnifiedModal>
        </div>

        {/* Product Management Modal */}
        <UnifiedModal
          isOpen={showProductDialog}
          onClose={(open) => {
            if (!open) {
              setShowProductDialog(false);
              setEditingProduct(null);
              setProductFormData({
                name: "",
                description: "",
                price: "",
                image: "",
                categoryId: "",
                brandName: "",
                additionalInfo: {},
                inStock: true,
                isActive: true,
              });
            }
          }}
          title={editingProduct ? "Edit Product" : "Add New Product"}
          description={
            editingProduct
              ? "Update product details"
              : "Create a new product or service"
          }
          footer={
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowProductDialog(false);
                  setEditingProduct(null);
                  setProductFormData({
                    name: "",
                    description: "",
                    price: "",
                    image: "",
                    categoryId: "",
                    brandName: "",
                    additionalInfo: {},
                    inStock: true,
                    isActive: true,
                  });
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  // Client-side validation
                  if (!productFormData.name.trim()) {
                    toast({
                      title: "Validation Error",
                      description: "Product name is required",
                      variant: "destructive",
                    });
                    return;
                  }

                  if (productFormData.name.length < 2) {
                    toast({
                      title: "Validation Error",
                      description:
                        "Product name must be at least 2 characters long",
                      variant: "destructive",
                    });
                    return;
                  }

                  setSavingProduct(true);
                  try {
                    const url = editingProduct
                      ? `/api/business/products/${editingProduct.id}`
                      : "/api/business/products";
                    const method = editingProduct ? "PUT" : "POST";
                    const response = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(productFormData),
                    });
                    if (response.ok) {
                      const data = await response.json();
                      if (editingProduct) {
                        // Update existing product
                        setProducts((prev) =>
                          prev.map((p) =>
                            p.id === editingProduct.id ? data.product : p,
                          ),
                        );
                        if (
                          data.product.image &&
                          !images.includes(data.product.image)
                        ) {
                          setImages((prev) => [
                            ...new Set([...prev, data.product.image]),
                          ]);
                        }
                        // Update stats if active status changed
                        if (editingProduct.isActive !== data.product.isActive) {
                          setStats((prev) => ({
                            ...prev,
                            activeProducts: data.product.isActive
                              ? prev.activeProducts + 1
                              : prev.activeProducts - 1,
                          }));
                        }
                      } else {
                        // Add new product
                        setProducts((prev) => [...prev, data.product]);
                        if (data.product.image) {
                          setImages((prev) => [
                            ...new Set([...prev, data.product.image]),
                          ]);
                        }
                        setStats((prev) => ({
                          ...prev,
                          totalProducts: prev.totalProducts + 1,
                          activeProducts: data.product.isActive
                            ? prev.activeProducts + 1
                            : prev.activeProducts,
                        }));
                      }
                      setShowProductDialog(false);
                      setEditingProduct(null);
                      setProductFormData({
                        name: "",
                        description: "",
                        price: "",
                        image: "",
                        categoryId: "",
                        brandName: "",
                        additionalInfo: {},
                        inStock: true,
                        isActive: true,
                      });
                      toast({
                        title: "Success",
                        description: editingProduct
                          ? "Product updated successfully!"
                          : "Product added successfully!",
                      });
                    } else {
                      const errorResult = await response.json();
                      toast({
                        title: "Error",
                        description: `Failed to ${editingProduct ? "update" : "add"} product: ${errorResult.error}`,
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: `Failed to ${editingProduct ? "update" : "add"} product. Please try again.`,
                      variant: "destructive",
                    });
                  } finally {
                    setSavingProduct(false);
                  }
                }}
                disabled={savingProduct}
                className="rounded-xl"
              >
                {savingProduct ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <div className="relative">
                <Input
                  id="name"
                  value={productFormData.name}
                  onChange={(e) =>
                    setProductFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Enter product name"
                  required
                  className="pl-10 rounded-md"
                />
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productFormData.description}
                onChange={(e) =>
                  setProductFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your product or service"
                rows={4}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <Input
                    id="price"
                    value={productFormData.price}
                    onChange={(e) =>
                      setProductFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="e.g., ₹50, Starting at ₹100, Free consultation"
                    className="pl-10 rounded-md"
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <div className="relative">
                  <Input
                    id="image"
                    value={productFormData.image}
                    onChange={(e) =>
                      setProductFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="pl-10 rounded-md"
                  />
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Existing Image</Label>
              <Select
                key={images.length}
                value={productFormData.image || "no-image"}
                onValueChange={(value) =>
                  setProductFormData((prev) => ({
                    ...prev,
                    image: value === "no-image" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="rounded-md w-full">
                  <SelectValue placeholder="Choose an existing image" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-image">No image</SelectItem>
                  {images.map((image) => {
                    // Display with image and ellipsized URL
                    const MAX_URL_LENGTH = 32;
                    let displayUrl = image;
                    if (image.length > MAX_URL_LENGTH) {
                      displayUrl = image.slice(0, MAX_URL_LENGTH) + "...";
                    }
                    return (
                      <SelectItem
                        className=" flex items-center gap-2"
                        key={image}
                        value={image}
                      >
                        <img
                          src={image}
                          alt={displayUrl}
                          className="inline-block h-8 w-8  rounded-full object-cover border pr-2"
                          style={{ minWidth: "2rem" }}
                        />
                        <span
                          className="truncate border-l px-2 border-l-gray-300 "
                          title={image}
                        >
                          {displayUrl}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              {mounted && (
                <ImageUpload
                  onUpload={(url) =>
                    setProductFormData((prev) => ({
                      ...prev,
                      image: url,
                    }))
                  }
                />
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Category Selection */}
              <div className="w-full md:w-1/2 space-y-2">
                <Label>Category</Label>
                <Select
                  key={categories.length}
                  value={productFormData.categoryId}
                  onValueChange={(value) =>
                    setProductFormData((prev) => ({
                      ...prev,
                      categoryId: value,
                    }))
                  }
                >
                  <SelectTrigger className="rounded-md w-full">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Brand Selection */}
              <div className="w-full md:w-1/2 space-y-2">
                <Label>Brand</Label>
                <div className="relative">
                  <Select
                    value={productFormData.brandName}
                    onValueChange={(value) =>
                      setProductFormData((prev) => ({
                        ...prev,
                        brandName: value,
                      }))
                    }
                  >
                    <SelectTrigger className="rounded-md w-full">
                      <SelectValue placeholder="Choose a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="max-h-48 overflow-y-auto">
                        {(brandContent.brands || []).map((brand: any) => (
                          <SelectItem key={brand.name} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex border-t border-b py-2 items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={productFormData.inStock}
                  onCheckedChange={(checked) =>
                    setProductFormData((prev) => ({
                      ...prev,
                      inStock: checked,
                    }))
                  }
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={productFormData.isActive}
                  onCheckedChange={(checked) =>
                    setProductFormData((prev) => ({
                      ...prev,
                      isActive: checked,
                    }))
                  }
                />
                <Label htmlFor="isActive">Visible </Label>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Input
                      placeholder="Key (e.g., Material)"
                      value={newInfoKey || ""}
                      onChange={(e) => setNewInfoKey(e.target.value)}
                      className="pl-10 rounded-md"
                    />
                    <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Value (e.g., Cotton)"
                        value={newInfoValue || ""}
                        onChange={(e) => setNewInfoValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddInfo();
                          }
                        }}
                        className="pl-10 rounded-md"
                      />
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddInfo}
                      disabled={!newInfoKey?.trim() || !newInfoValue?.trim()}
                      className="rounded-md"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {productFormData.additionalInfo &&
                  Object.keys(productFormData.additionalInfo).length > 0 && (
                    <div className="overflow-x-auto mt-4">
                      <table className="min-w-full bg-gray-50 rounded-md">
                        <tbody>
                          {Object.entries(productFormData.additionalInfo).map(
                            ([key, value], index) => (
                              <tr
                                key={index}
                                className="border-b last:border-b-0"
                              >
                                <td className="px-3 py-2 font-medium text-sm">
                                  {key}
                                </td>
                                <td className="px-3 py-2 text-sm">{value}</td>
                                <td className="py-2 text-right pr-4">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveInfo(key)}
                                    className="h-6 w-6 p-0 hover:bg-gray-200 rounded-full flex items-center justify-center ml-auto"
                                    title="Remove field"
                                  >
                                    <span className="sr-only">Remove</span>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </UnifiedModal>

        {/* Individual Delete/Confirmation Dialogs */}
        
        {/* Delete Product Dialog */}
        <Dialog open={showDeleteProductDialog} onOpenChange={setShowDeleteProductDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteProductDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteProduct}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteCategoryDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteCategory}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Brand Dialog */}
        <Dialog open={showDeleteBrandDialog} onOpenChange={setShowDeleteBrandDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Brand</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{brandToDeleteName}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteBrandDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteBrand}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Portfolio Image Dialog */}
        <Dialog open={showDeletePortfolioDialog} onOpenChange={setShowDeletePortfolioDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Portfolio Image</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this portfolio image? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeletePortfolioDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeletePortfolio}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Activate Products Dialog */}
        <Dialog open={showBulkActivateDialog} onOpenChange={setShowBulkActivateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Products</DialogTitle>
              <DialogDescription>
                Are you sure you want to activate {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBulkActivateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={confirmBulkActivate}>
                Activate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Deactivate Products Dialog */}
        <Dialog open={showBulkDeactivateDialog} onOpenChange={setShowBulkDeactivateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate Products</DialogTitle>
              <DialogDescription>
                Are you sure you want to deactivate {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBulkDeactivateDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmBulkDeactivate}>
                Deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Products Dialog */}
        <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Products</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedProducts.length} product{selectedProducts.length > 1 ? "s" : ""}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmBulkDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}


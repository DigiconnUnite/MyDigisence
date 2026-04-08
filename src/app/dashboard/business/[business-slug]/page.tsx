"use client";

import { useState, useEffect, useCallback, type ComponentProps } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import SharedSidebar from "../../components/SharedSidebar";
import SharedDashboardHeader from "../../components/SharedDashboardHeader";
import type {
  BrandContent,
  Business,
  Category,
  Inquiry,
  PortfolioContent,
  Product,
} from "../types";
import {
  buildBusinessStats,
  getUniqueProductImages,
} from "../hooks/businessDataHelpers";
import { useBusinessDataLoader } from "../hooks/useBusinessDataLoader";
import { useBusinessMutations } from "../hooks/useBusinessMutations";
import { useProductMutations } from "../hooks/useProductMutations";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import { useInquiryMutations } from "../hooks/useInquiryMutations";
import { BusinessDashboardOverview } from "../components/BusinessDashboardOverview";
import { BusinessProductsSection } from "../components/BusinessProductsSection";
import { BusinessInquiriesSection } from "../components/BusinessInquiriesSection";
import { BusinessBrandsSection } from "../components/BusinessBrandsSection";
import { BusinessPortfolioSection } from "../components/BusinessPortfolioSection";
import { BusinessCategoriesSection } from "../components/BusinessCategoriesSection";
import { BusinessConfirmationDialogs } from "../components/BusinessConfirmationDialogs";
import { BusinessProductModal } from "../components/BusinessProductModal";
import { BusinessCategoryModal } from "../components/BusinessCategoryModal";
import { BusinessInfoSection } from "../components/BusinessInfoSection";
import { BusinessHeroSection } from "../components/BusinessHeroSection";
import { BusinessPlaceholderSection } from "../components/BusinessPlaceholderSection";
import { BusinessHeaderAvatar } from "../components/BusinessHeaderAvatar";

const createEmptyProductFormData = () => ({
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

const createEmptyCategoryFormData = () => ({
  name: "",
  description: "",
  parentId: "",
});

export default function BusinessAdminDashboard() {
  type HeroBannerContent = ComponentProps<typeof HeroBannerManager>["heroContent"];

  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("dashboard");

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
  const [productFormData, setProductFormData] = useState(createEmptyProductFormData());
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
  const [brandContent, setBrandContent] = useState<BrandContent>({ brands: [] });
  const [portfolioContent, setPortfolioContent] = useState<PortfolioContent>({ images: [] });
  const [footerContent, setFooterContent] = useState<Record<string, unknown>>({});
  const [heroContent, setHeroContent] = useState<HeroBannerContent>({
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
  const [categoryFormData, setCategoryFormData] = useState(createEmptyCategoryFormData());
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

  const { updateBusinessInfo, updateHeroContent, updateBrandContent, updatePortfolioContent } =
    useBusinessMutations();
  const {
    saveProduct,
    deleteProduct,
    bulkSetProductActiveState,
    bulkDeleteProducts,
  } = useProductMutations();
  const { saveCategory, deleteCategory } = useCategoryMutations();
  const { updateInquiryStatus } = useInquiryMutations();

  const applyBusinessFormState = useCallback((nextBusiness: Business | null) => {
    if (!nextBusiness) {
      setBusiness(null);
      return;
    }

    setBusiness(nextBusiness);
    setBrandContent(nextBusiness.brandContent || { brands: [] });
    setPortfolioContent(nextBusiness.portfolioContent || { images: [] });
    setFooterContent(nextBusiness.footerContent || {});
    setHeroContent(
      nextBusiness.heroContent || {
        slides: [],
        autoPlay: true,
        transitionSpeed: 5,
      },
    );

    setBusinessInfoFormData({
      name: nextBusiness.name || "",
      description: nextBusiness.description || "",
      about: nextBusiness.about || "",
      logo: nextBusiness.logo || "",
      address: nextBusiness.address || "",
      ...(nextBusiness.logo && { logo: nextBusiness.logo }),
      phone: nextBusiness.phone || "",
      email: nextBusiness.email || "",
      website: nextBusiness.website || "",
      ownerName: nextBusiness.admin?.name || "",
      facebook: nextBusiness.facebook || "",
      twitter: nextBusiness.twitter || "",
      instagram: nextBusiness.instagram || "",
      linkedin: nextBusiness.linkedin || "",
      catalogPdf: nextBusiness.catalogPdf || "",
      openingHours: nextBusiness.openingHours || [],
      gstNumber: nextBusiness.gstNumber || "",
    });
  }, []);

  const { loadBusinessDashboardData, cancelLoad } = useBusinessDataLoader({
    onSuccess: ({ data, stats: nextStats, images: nextImages }) => {
      applyBusinessFormState(data.business);
      setCategories(data.categories);
      setProducts(data.products);
      setInquiries(data.inquiries);
      setImages(nextImages);
      setStats(nextStats);
    },
    onError: (message) => {
      toast({
        title: "Error",
        description: `${message}. Please refresh the page.`,
        variant: "destructive",
      });
    },
    onFinally: () => setIsLoading(false),
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    await loadBusinessDashboardData();
  }, [loadBusinessDashboardData]);

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

    return () => {
      cancelLoad();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, router, fetchData, cancelLoad]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      const result = await deleteProduct(productToDelete.id);

      if (result.ok) {
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
        toast({
          title: "Error",
          description: result.error,
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
      const result = await updateInquiryStatus(
        inquiryId,
        newStatus as Inquiry["status"],
      );

      if (result.ok) {
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
        toast({
          title: "Error",
          description: result.error,
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

  const handleCloseProductDialog = () => {
    setShowProductDialog(false);
    setEditingProduct(null);
    setProductFormData(createEmptyProductFormData());
    setNewInfoKey("");
    setNewInfoValue("");
  };

  const handleOpenProductDialog = () => {
    setEditingProduct(null);
    setProductFormData(createEmptyProductFormData());
    setShowProductDialog(true);
  };

  const handleNavigateToProducts = () => {
    setActiveSection("products");
    handleOpenProductDialog();
  };

  const handleOpenCatalogPreview = () => {
    if (business?.slug) {
      window.open(`/catalog/${business.slug}`, "_blank");
    }
  };

  const handleSaveProduct = async () => {
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
        description: "Product name must be at least 2 characters long",
        variant: "destructive",
      });
      return;
    }

    setSavingProduct(true);
    try {
      const result = await saveProduct(productFormData, editingProduct?.id);

      if (result.ok && result.data?.product) {
        const nextProduct = result.data.product;

        if (editingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? nextProduct : p)),
          );

          if (nextProduct.image && !images.includes(nextProduct.image)) {
            const imageUrl = nextProduct.image;
            setImages((prev) => [...new Set([...prev, imageUrl])]);
          }

          if (editingProduct.isActive !== nextProduct.isActive) {
            setStats((prev) => ({
              ...prev,
              activeProducts: nextProduct.isActive
                ? prev.activeProducts + 1
                : prev.activeProducts - 1,
            }));
          }
        } else {
          setProducts((prev) => [...prev, nextProduct]);
          if (nextProduct.image) {
            const imageUrl = nextProduct.image;
            setImages((prev) => [...new Set([...prev, imageUrl])]);
          }
          setStats((prev) => ({
            ...prev,
            totalProducts: prev.totalProducts + 1,
            activeProducts: nextProduct.isActive
              ? prev.activeProducts + 1
              : prev.activeProducts,
          }));
        }

        handleCloseProductDialog();
        toast({
          title: "Success",
          description: editingProduct
            ? "Product updated successfully!"
            : "Product added successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.ok
            ? `Failed to ${editingProduct ? "update" : "add"} product`
            : result.error,
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
      const result = await updateBusinessInfo(updateData);

      if (result.ok && result.data?.business) {
        console.log("Business update successful. Response:", result);
        console.log("Updated business logo:", result.data.business.logo);
        setBusiness(result.data.business);
        toast({
          title: "Success",
          description: "Business information updated successfully!",
        });
      } else {
        console.error("Business update failed:", result);
        toast({
          title: "Error",
          description: result.ok
            ? "Failed to update business information"
            : result.error,
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

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCategoryFormData(createEmptyCategoryFormData());
  };

  const handleSaveCategoryFromModal = async () => {
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
      const result = await saveCategory(categoryFormData, editingCategory?.id);

      if (result.ok && result.data?.category) {
        if (editingCategory) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? result.data!.category! : c)),
          );
        } else {
          setCategories((prev) => [...prev, result.data!.category!]);
        }

        handleCloseCategoryModal();
        await fetchData();
        toast({
          title: "Success",
          description: editingCategory
            ? "Category updated successfully!"
            : "Category created successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.ok
            ? `Failed to ${editingCategory ? "update" : "create"} category`
            : result.error,
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
  };

  const handleHeroContentChange = async (newContent: HeroBannerContent) => {
    setHeroContent(newContent);
    if (!business) return;
    try {
      const result = await updateHeroContent(newContent);
      if (result.ok && result.data?.business) {
        setBusiness(result.data.business);
        toast({
          title: "Success",
          description: "Hero content saved successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.ok
            ? "Failed to save hero content"
            : result.error,
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
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteCategoryDialog(true);
  };

  const handleCreateCategory = async () => {
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
      const result = await saveCategory(categoryFormData);

      if (result.ok && result.data?.category) {
        setCategories((prev) => [...prev, result.data!.category!]);
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
        toast({
          title: "Error",
          description: result.ok ? "Failed to create category" : result.error,
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
  };

  const handleAddBrand = async () => {
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

    const updatedBrands = [...(brandContent.brands || []), newBrand];

    try {
      const result = await updateBrandContent(updatedBrands);

      if (result.ok) {
        setBrandContent((prev) => ({
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
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingBrand(false);
    }
  };

  const handleEditBrandName = async (index: number) => {
    const brand = brandContent.brands[index];
    if (!brand) return;

    const newName = prompt("Edit brand name:", brand.name);
    if (!newName || !newName.trim()) {
      return;
    }

    const updatedBrands = [...brandContent.brands];
    updatedBrands[index] = {
      ...brand,
      name: newName.trim(),
    };

    try {
      const result = await updateBrandContent(updatedBrands);
      if (result.ok) {
        setBrandContent((prev) => ({
          ...prev,
          brands: updatedBrands,
        }));
        toast({
          title: "Success",
          description: "Brand updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update brand. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSavePortfolioImages = async (images: { url: string; alt?: string }[]) => {
    try {
      const result = await updatePortfolioContent(images);

      if (result.ok) {
        setPortfolioContent((prev) => ({
          ...prev,
          images,
        }));
        toast({
          title: "Success",
          description: "Portfolio updated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const result = await deleteCategory(categoryToDelete.id);

      if (result.ok) {
        await fetchData();
        toast({
          title: "Success",
          description: "Category deleted successfully!",
        });
        setShowDeleteCategoryDialog(false);
        setCategoryToDelete(null);
      } else {
        toast({
          title: "Error",
          description: result.error,
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
      const result = await updateBrandContent(updatedBrands);

      if (result.ok) {
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
        toast({
          title: "Error",
          description: result.error,
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
      const result = await updatePortfolioContent(updatedImages);

      if (result.ok) {
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
        toast({
          title: "Error",
          description: result.error,
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
      const results = await bulkSetProductActiveState(selectedProducts, true);
      const failedResult = results.find((result) => !result.ok);
      if (failedResult && !failedResult.ok) {
        throw new Error(failedResult.error);
      }
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
      const results = await bulkSetProductActiveState(selectedProducts, false);
      const failedResult = results.find((result) => !result.ok);
      if (failedResult && !failedResult.ok) {
        throw new Error(failedResult.error);
      }
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
      const results = await bulkDeleteProducts(selectedProducts);
      const failedResult = results.find((result) => !result.ok);
      if (failedResult && !failedResult.ok) {
        throw new Error(failedResult.error);
      }
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
                    onClick={handleOpenCatalogPreview}
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
                    onClick={handleOpenCatalogPreview}
                    className="rounded-full px-3 py-0  bg-slate-800  text-white border-0 hover:text-white hover:opacity-90 transition-opacity"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">View</span>
                  </Button>
                </div>
              </>
            }
            avatar={
              <BusinessHeaderAvatar
                businessName={business?.name || "Business Admin"}
                logoUrl={business?.logo || null}
              />
            }
          />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
            <div className="p-4 max-w-7xl mx-auto sm:p-6">
              {/* Main Content based on activeSection */}
              {activeSection === "dashboard" && (
                <BusinessDashboardOverview
                  stats={stats}
                  business={business}
                  heroSlidesCount={heroSlides.length}
                  inquiries={inquiries}
                  formatDate={formatDate}
                  onNavigateToProducts={handleNavigateToProducts}
                  onNavigateToInfo={() => setActiveSection("info")}
                  onNavigateToInquiries={() => setActiveSection("inquiries")}
                />
              )}

              {activeSection === "info" && (
                <BusinessInfoSection
                  formData={businessInfoFormData}
                  fallbackAdminName={user?.name || "Admin"}
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
                />
              )}

              {activeSection === "hero" && (
                <BusinessHeroSection
                  heroContent={heroContent}
                  onChange={handleHeroContentChange}
                />
              )}

              {activeSection === "brands" && (
                <BusinessBrandsSection
                  sectionTitle={sectionTitles.brands}
                  onSectionTitleChange={(value) =>
                    setSectionTitles((prev) => ({ ...prev, brands: value }))
                  }
                  brandContent={brandContent}
                  savingBrand={savingBrand}
                  onBrandNameChange={(value) =>
                    setBrandContent((prev) => ({ ...prev, newBrandName: value }))
                  }
                  onBrandLogoChange={(value) =>
                    setBrandContent((prev) => ({ ...prev, newBrandLogo: value }))
                  }
                  onBrandLogoUpload={(url) =>
                    setBrandContent((prev) => ({ ...prev, newBrandLogo: url }))
                  }
                  onAddBrand={handleAddBrand}
                  onEditBrand={handleEditBrandName}
                  onDeleteBrand={(index, name) => {
                    setBrandToDeleteIndex(index);
                    setBrandToDeleteName(name);
                    setShowDeleteBrandDialog(true);
                  }}
                />
              )}

              {activeSection === "portfolio" && (
                <BusinessPortfolioSection
                  sectionTitle={sectionTitles.portfolio}
                  onSectionTitleChange={(value) =>
                    setSectionTitles((prev) => ({ ...prev, portfolio: value }))
                  }
                  images={portfolioContent.images || []}
                  onSaveImages={handleSavePortfolioImages}
                  onDeleteImageRequest={(index) => {
                    setPortfolioToDeleteIndex(index);
                    setShowDeletePortfolioDialog(true);
                  }}
                />
              )}

              {activeSection === "categories" && (
                <BusinessCategoriesSection
                  sectionTitle={sectionTitles.categories}
                  onSectionTitleChange={(value) =>
                    setSectionTitles((prev) => ({ ...prev, categories: value }))
                  }
                  categoryFormData={categoryFormData}
                  onCategoryFormChange={setCategoryFormData}
                  categories={categories}
                  savingCategory={savingCategory}
                  onCreateCategory={handleCreateCategory}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              )}

              {activeSection === "products" && (
                <BusinessProductsSection
                  products={products}
                  categories={categories}
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  selectedProducts={selectedProducts}
                  mounted={mounted}
                  productCurrentPage={productCurrentPage}
                  productItemsPerPage={productItemsPerPage}
                  onSelectedCategoryChange={setSelectedCategory}
                  onSelectedProductsChange={setSelectedProducts}
                  onProductCurrentPageChange={setProductCurrentPage}
                  onProductItemsPerPageChange={setProductItemsPerPage}
                  onOpenBulkActivate={() => setShowBulkActivateDialog(true)}
                  onOpenBulkDeactivate={() => setShowBulkDeactivateDialog(true)}
                  onOpenBulkDelete={() => setShowBulkDeleteDialog(true)}
                  onAddProduct={handleOpenProductDialog}
                  onEditProduct={(product) => {
                    handleProductEdit(product);
                    setShowProductDialog(true);
                  }}
                  onShareProduct={handleShare}
                  onDeleteProduct={handleProductDelete}
                />
              )}

              {activeSection === "inquiries" && (
                <BusinessInquiriesSection
                  inquiries={inquiries}
                  stats={stats}
                  formatDate={formatDate}
                  onStatusUpdate={handleInquiryStatusUpdate}
                />
              )}

              {activeSection === "analytics" && (
                <BusinessPlaceholderSection
                  heading="Analytics"
                  subtitle="Track your business performance"
                  cardTitle="Analytics Coming Soon"
                  cardDescription="Detailed analytics and insights will be available here"
                  icon={BarChart3}
                />
              )}

              {activeSection === "settings" && (
                <BusinessPlaceholderSection
                  heading="Settings"
                  subtitle="Manage your account and preferences"
                  cardTitle="Settings Coming Soon"
                  cardDescription="Account settings and preferences will be available here"
                  icon={Settings}
                />
              )}
            </div>
          </div>

          <BusinessCategoryModal
            isOpen={showCategoryModal}
            editingCategory={editingCategory}
            categoryFormData={categoryFormData}
            setCategoryFormData={setCategoryFormData}
            categories={categories}
            sectionTitle={sectionTitles.categories}
            onSectionTitleChange={(value) =>
              setSectionTitles((prev) => ({
                ...prev,
                categories: value,
              }))
            }
            savingCategory={savingCategory}
            onClose={handleCloseCategoryModal}
            onSave={handleSaveCategoryFromModal}
          />
        </div>

        {/* Product Management Modal */}
        <BusinessProductModal
          isOpen={showProductDialog}
          editingProduct={editingProduct}
          productFormData={productFormData}
          setProductFormData={setProductFormData}
          categories={categories}
          brandContent={brandContent}
          images={images}
          mounted={mounted}
          savingProduct={savingProduct}
          newInfoKey={newInfoKey}
          newInfoValue={newInfoValue}
          onNewInfoKeyChange={setNewInfoKey}
          onNewInfoValueChange={setNewInfoValue}
          onAddInfo={handleAddInfo}
          onRemoveInfo={handleRemoveInfo}
          onClose={handleCloseProductDialog}
          onSave={handleSaveProduct}
        />

        <BusinessConfirmationDialogs
          showDeleteProductDialog={showDeleteProductDialog}
          setShowDeleteProductDialog={setShowDeleteProductDialog}
          productToDelete={productToDelete}
          onConfirmDeleteProduct={confirmDeleteProduct}
          showDeleteCategoryDialog={showDeleteCategoryDialog}
          setShowDeleteCategoryDialog={setShowDeleteCategoryDialog}
          categoryToDelete={categoryToDelete}
          onConfirmDeleteCategory={confirmDeleteCategory}
          showDeleteBrandDialog={showDeleteBrandDialog}
          setShowDeleteBrandDialog={setShowDeleteBrandDialog}
          brandToDeleteName={brandToDeleteName}
          onConfirmDeleteBrand={confirmDeleteBrand}
          showDeletePortfolioDialog={showDeletePortfolioDialog}
          setShowDeletePortfolioDialog={setShowDeletePortfolioDialog}
          onConfirmDeletePortfolio={confirmDeletePortfolio}
          showBulkActivateDialog={showBulkActivateDialog}
          setShowBulkActivateDialog={setShowBulkActivateDialog}
          showBulkDeactivateDialog={showBulkDeactivateDialog}
          setShowBulkDeactivateDialog={setShowBulkDeactivateDialog}
          showBulkDeleteDialog={showBulkDeleteDialog}
          setShowBulkDeleteDialog={setShowBulkDeleteDialog}
          selectedProductsCount={selectedProducts.length}
          onConfirmBulkActivate={confirmBulkActivate}
          onConfirmBulkDeactivate={confirmBulkDeactivate}
          onConfirmBulkDelete={confirmBulkDelete}
        />
      </div>
    </div>
  );
}


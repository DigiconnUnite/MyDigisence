"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, ThemeProvider } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Package,
  Mail,
  Grid3X3,
  Building,
  Image,
  BarChart3,
  Settings,
  User,
} from "lucide-react";
import { BusinessErrorBoundary } from "../components/BusinessErrorBoundary";
import { useBusinessSearch } from "../hooks/useBusinessSearch";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useBusinessData } from "../hooks/useBusinessData";
import { useBusinessMutations } from "../hooks/useBusinessMutations";
import { useProductMutations } from "../hooks/useProductMutations";
import { useInquiryMutations } from "../hooks/useInquiryMutations";
import { useCategoryMutations } from "../hooks/useCategoryMutations";
import { BusinessDashboardLayout, BusinessLoadingLayout } from "../components/BusinessLayouts";
import type {
  Product,
  Inquiry,
  Business,
  BrandContent,
  ProductFormData,
  Category,
  CategoryFormData,
  PortfolioItem,
  BusinessInfoFormData,
} from "../types";
import BusinessProfile from "@/components/BusinessProfile";

// View Components
import OverviewView from "../views/OverviewView";
import ProductsView from "../views/ProductsView";
import InquiriesView from "../views/InquiriesView";
import CategoriesView from "../views/CategoriesView";
import BrandsView from "../views/BrandsView";
import PortfolioView from "../views/PortfolioView";
import AnalyticsView from "../views/AnalyticsView";
import SettingsView from "../views/SettingsView";
import { BusinessCategoryModal } from "../components/BusinessCategoryModal";

type BusinessView = "dashboard" | "profile" | "products" | "inquiries" | "categories" | "brands" | "portfolio" | "analytics" | "settings";

const VALID_BUSINESS_VIEWS: BusinessView[] = [
  "dashboard",
  "profile",
  "products",
  "inquiries",
  "categories",
  "brands",
  "portfolio",
  "analytics",
  "settings",
];

export default function BusinessAdminDashboardRefactored() {
  const { user, loading, logout } = useAuth();
  const { getBackgroundClass } = useTheme();
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<BusinessView>("dashboard");

  // Use the business data hook
  const {
    business,
    categories,
    products,
    inquiries,
    brands,
    images,
    viewSeries,
    statsSnapshot,
    isLoading,
    error,
    fetchData,
    cancelLoad,
    updateBusinessState,
  } = useBusinessData();

  const { updateBusinessInfo, updateBrandContent, updatePortfolioContent } = useBusinessMutations();
  const { saveProduct, deleteProduct, bulkSetProductActiveState, bulkDeleteProducts } = useProductMutations();
  const { updateInquiryStatus } = useInquiryMutations();
  const { saveCategory, deleteCategory } = useCategoryMutations();

  const emptyProductFormData: ProductFormData = {
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
    brandName: "",
    additionalInfo: {},
    inStock: true,
    isActive: true,
  };

  const emptyCategoryFormData: CategoryFormData = {
    name: "",
    description: "",
    parentId: "",
  };

  // State management for views
  const [viewSearchTerm, setViewSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [productItemsPerPage, setProductItemsPerPage] = useState(10);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>(emptyProductFormData);
  const [savingProduct, setSavingProduct] = useState(false);
  const [newInfoKey, setNewInfoKey] = useState("");
  const [newInfoValue, setNewInfoValue] = useState("");
  const [updatingInquiry, setUpdatingInquiry] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [brandContentDraft, setBrandContentDraft] = useState<BrandContent>({
    brands: [],
    newBrandName: "",
    newBrandLogo: "",
  });
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>(emptyCategoryFormData);
  const [savingBrand, setSavingBrand] = useState(false);
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [portfolioContent, setPortfolioContent] = useState<any>({ images: [] });

  // Navigation handlers
  const handleNavigateToProducts = () => setActiveSection("products");
  const handleNavigateToInfo = () => setActiveSection("settings");
  const handleNavigateToInquiries = () => setActiveSection("inquiries");
  const handleOpenCatalogPreview = () => {
    if (!business?.slug) {
      toast({
        title: "Missing business slug",
        description: "Save your business profile before previewing the catalog.",
        variant: "destructive",
      });
      return;
    }
    window.open(`/b/${business.slug}`, "_blank");
  };
  
  // Form handlers
  const handleSearchTermChange = (term: string) => setViewSearchTerm(term);
  const handleSelectedCategoryChange = (category: string) => setSelectedCategory(category);
  const handleSelectedProductsChange = (products: string[]) => setSelectedProducts(products);
  const handleProductCurrentPageChange = (page: number) => setProductCurrentPage(page);
  const handleProductItemsPerPageChange = (limit: number) => setProductItemsPerPage(limit);
  const handleOpenProductDialog = () => {
    setEditingProduct(null);
    setProductFormData(emptyProductFormData);
    setShowProductDialog(true);
  };
  const handleCloseProductDialog = () => {
    setShowProductDialog(false);
    setEditingProduct(null);
    setProductFormData(emptyProductFormData);
    setNewInfoKey("");
    setNewInfoValue("");
  };
  const handleProductEdit = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description ?? "",
      price: product.price ? String(product.price) : "",
      image: product.image ?? "",
      categoryId: product.categoryId ?? "",
      brandName: product.brandName ?? "",
      additionalInfo: product.additionalInfo ?? {},
      inStock: product.inStock,
      isActive: product.isActive,
    });
    setShowProductDialog(true);
  };
  const handleProductDelete = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}?`)) {
      return;
    }
    const result = await deleteProduct(product.id);
    if (!result.ok) {
      toast({
        title: "Delete failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Product deleted" });
    await fetchData();
  };
  const handleProductSave = async () => {
    if (!productFormData.name.trim()) {
      toast({
        title: "Product name required",
        description: "Please enter a product name.",
        variant: "destructive",
      });
      return;
    }

    setSavingProduct(true);
    const result = await saveProduct(productFormData, editingProduct?.id);
    setSavingProduct(false);

    if (!result.ok) {
      toast({
        title: "Save failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: editingProduct ? "Product updated" : "Product added" });
    handleCloseProductDialog();
    await fetchData();
  };
  const handleProductFormDataChange = (data: ProductFormData) => setProductFormData(data);
  const handleNewInfoKeyChange = (value: string) => setNewInfoKey(value);
  const handleNewInfoValueChange = (value: string) => setNewInfoValue(value);
  const handleAddInfo = () => {
    const key = newInfoKey.trim();
    const value = newInfoValue.trim();
    if (!key || !value) {
      toast({
        title: "Missing info",
        description: "Provide both a key and value.",
        variant: "destructive",
      });
      return;
    }
    setProductFormData((prev) => ({
      ...prev,
      additionalInfo: {
        ...(prev.additionalInfo ?? {}),
        [key]: value,
      },
    }));
    setNewInfoKey("");
    setNewInfoValue("");
  };
  const handleRemoveInfo = (key: string) => {
    setProductFormData((prev) => {
      const nextInfo = { ...(prev.additionalInfo ?? {}) };
      delete nextInfo[key];
      return {
        ...prev,
        additionalInfo: nextInfo,
      };
    });
  };
  const handleShare = async (product: Product) => {
    const shareText = `${product.name}`;
    await navigator.clipboard.writeText(shareText);
    toast({ title: "Copied", description: "Product name copied to clipboard." });
  };
  const handleBulkActivate = async () => {
    if (selectedProducts.length === 0) {
      return;
    }
    await bulkSetProductActiveState(selectedProducts, true);
    setSelectedProducts([]);
    await fetchData();
  };
  const handleBulkDeactivate = async () => {
    if (selectedProducts.length === 0) {
      return;
    }
    await bulkSetProductActiveState(selectedProducts, false);
    setSelectedProducts([]);
    await fetchData();
  };
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      return;
    }
    if (!window.confirm(`Delete ${selectedProducts.length} products?`)) {
      return;
    }
    await bulkDeleteProducts(selectedProducts);
    setSelectedProducts([]);
    await fetchData();
  };
  const handleInquiryStatusUpdate = async (id: string, status: string) => {
    setUpdatingInquiry(id);
    const result = await updateInquiryStatus(id, status as any);
    setUpdatingInquiry(null);

    if (!result.ok) {
      toast({
        title: "Update failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    await fetchData();
  };
  const handleSectionTitleChange = (title: string) => setSectionTitle(title);
  const handlePortfolioContentChange = (content: any) => setPortfolioContent(content);
  const handleSavePortfolio = async (images: PortfolioItem[]) => {
    const nextImages = images ?? portfolioContent.images ?? [];
    setSavingPortfolio(true);
    const result = await updatePortfolioContent(nextImages);
    setSavingPortfolio(false);

    if (!result.ok) {
      toast({
        title: "Save failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    if (result.data?.business) {
      updateBusinessState(result.data.business as Business);
    }
    toast({ title: "Portfolio updated" });
  };
  const handleBusinessUpdate = async (payload: Partial<BusinessInfoFormData>) => {
    const result = await updateBusinessInfo(payload);
    if (!result.ok) {
      toast({
        title: "Update failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    if (result.data?.business) {
      updateBusinessState(result.data.business as Business);
    }
    toast({ title: "Business updated" });
  };
  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const heroSlidesCount =
    business?.portfolioContent?.images?.length
    ?? business?.heroContent?.slides?.length
    ?? 0;
  
  // BrandsView handlers
  const handleBrandNameChange = (value: string) =>
    setBrandContentDraft((prev) => ({ ...prev, newBrandName: value }));
  const handleBrandLogoChange = (value: string) =>
    setBrandContentDraft((prev) => ({ ...prev, newBrandLogo: value }));
  const handleBrandLogoUpload = (url: string) =>
    setBrandContentDraft((prev) => ({ ...prev, newBrandLogo: url }));
  const handleAddBrand = async () => {
    const name = (brandContentDraft.newBrandName || "").trim();
    const logo = (brandContentDraft.newBrandLogo || "").trim();

    if (!name) {
      toast({
        title: "Brand name required",
        description: "Enter a brand name before saving.",
        variant: "destructive",
      });
      return;
    }

    const nextBrands = [...(brandContentDraft.brands || []), { name, logo: logo || undefined }];
    setSavingBrand(true);
    const result = await updateBrandContent(nextBrands);
    setSavingBrand(false);

    if (!result.ok) {
      toast({
        title: "Save failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    if (result.data?.business) {
      updateBusinessState(result.data.business as Business);
    }

    setBrandContentDraft({ brands: nextBrands, newBrandName: "", newBrandLogo: "" });
    toast({ title: "Brand added" });
  };
  const handleEditBrand = (index: number) => {
    const brand = brandContentDraft.brands[index];
    if (!brand) {
      return;
    }
    setBrandContentDraft((prev) => ({
      ...prev,
      newBrandName: brand.name,
      newBrandLogo: brand.logo || "",
    }));
  };
  const handleDeleteBrand = async (index: number, name: string) => {
    if (!window.confirm(`Delete brand ${name}?`)) {
      return;
    }
    const nextBrands = brandContentDraft.brands.filter((_, i) => i !== index);
    setSavingBrand(true);
    const result = await updateBrandContent(nextBrands);
    setSavingBrand(false);

    if (!result.ok) {
      toast({
        title: "Delete failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    if (result.data?.business) {
      updateBusinessState(result.data.business as Business);
    }

    setBrandContentDraft((prev) => ({
      ...prev,
      brands: nextBrands,
    }));
    toast({ title: "Brand deleted" });
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData(emptyCategoryFormData);
    setShowCategoryDialog(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || "",
      parentId: category.parentId || "",
    });
    setShowCategoryDialog(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete category ${category.name}?`)) {
      return;
    }
    const result = await deleteCategory(category.id);
    if (!result.ok) {
      toast({
        title: "Delete failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Category deleted" });
    await fetchData();
  };

  const handleSaveCategory = async () => {
    if (!categoryFormData.name.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }
    setSavingCategory(true);
    const result = await saveCategory(categoryFormData, editingCategory?.id);
    setSavingCategory(false);

    if (!result.ok) {
      toast({
        title: "Save failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({ title: editingCategory ? "Category updated" : "Category added" });
    setShowCategoryDialog(false);
    setEditingCategory(null);
    setCategoryFormData(emptyCategoryFormData);
    await fetchData();
  };

  // Advanced search hook
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,
    handleSearchResultSelect,
  } = useBusinessSearch({
    products,
    inquiries,
    categories,
    brands,
    onNavigateToProducts: () => setActiveSection("products"),
    onNavigateToInquiries: () => setActiveSection("inquiries"),
    onNavigateToCategories: () => setActiveSection("categories"),
    onNavigateToBrands: () => setActiveSection("brands"),
  });

  // Transform search results to match HeaderSearchResult interface
  const transformedSearchResults = useMemo(() => {
    return searchResults.map((item: any) => ({
      id: item.id,
      label: item.title,
      description: item.subtitle || '',
      routeLabel: item.type,
      view: item.type === 'product' ? 'products' : item.type === 'inquiry' ? 'inquiries' : undefined,
    }));
  }, [searchResults]);

  const transformedRecentSearches = useMemo(() => {
    return recentSearches.map((search: any) => ({
      id: search,
      label: search,
      description: 'Recent search',
    }));
  }, [recentSearches]);

  const handleTransformedSearchResultSelect = (result: any) => {
    if (typeof result === 'string') {
      // Handle recent search
      setSearchTerm(result);
    } else {
      // Handle search result
      handleSearchResultSelect(result);
    }
  };

  // Keyboard shortcuts
  const keyboardShortcuts = useMemo(
    () => [
      {
        key: "p",
        ctrlKey: true,
        action: () => setActiveSection("products"),
        description: "Go to Products",
      },
      {
        key: "i",
        ctrlKey: true,
        action: () => setActiveSection("inquiries"),
        description: "Go to Inquiries",
      },
      {
        key: "c",
        ctrlKey: true,
        action: () => setActiveSection("categories"),
        description: "Go to Categories",
      },
      {
        key: "b",
        ctrlKey: true,
        action: () => setActiveSection("brands"),
        description: "Go to Brands",
      },
      {
        key: "d",
        ctrlKey: true,
        action: () => setActiveSection("dashboard"),
        description: "Go to Dashboard",
      },
      {
        key: "s",
        ctrlKey: true,
        action: () => setActiveSection("settings"),
        description: "Go to Settings",
      },
      {
        key: "/",
        action: () => {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          searchInput?.focus();
        },
        description: "Focus search",
      },
    ],
    []
  );

  useKeyboardShortcuts({ shortcuts: keyboardShortcuts, enabled: mounted });

  // Authentication check
  useEffect(() => {
    if (!loading && (!user || user.role !== "BUSINESS_ADMIN")) {
      router.push("/login");
      return;
    }

    if (user?.role === "BUSINESS_ADMIN") {
      fetchData();
    }

    return () => {
      cancelLoad();
    };
  }, [user, loading, router, fetchData, cancelLoad]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setPortfolioContent(business?.portfolioContent ?? { images: [] });
    setBrandContentDraft({
      brands: business?.brandContent?.brands ?? [],
      newBrandName: "",
      newBrandLogo: "",
    });
  }, [business?.brandContent?.brands, business?.portfolioContent]);

  // Calculate stats for views
  const stats = useMemo(() => ({
    totalProducts: statsSnapshot?.products.total ?? products.length,
    activeProducts: statsSnapshot?.products.active ?? products.filter((p: Product) => p.isActive).length,
    totalInquiries: statsSnapshot?.inquiries.total ?? inquiries.length,
    newInquiries: statsSnapshot?.inquiries.new ?? inquiries.filter((i: Inquiry) => i.status === "NEW").length,
    profileViews: statsSnapshot?.views ?? business?.profileViews ?? 0,
  }), [products, inquiries, business, statsSnapshot]);

  // Navigation menu items
  const menuItems = useMemo(() => [
    { 
      value: "dashboard", 
      title: "Dashboard", 
      mobileTitle: "Dashboard",
      icon: LayoutDashboard,
      mobileIcon: LayoutDashboard
    },
    { 
      value: "profile", 
      title: "Business Profile", 
      mobileTitle: "Profile",
      icon: User,
      mobileIcon: User
    },
    { 
      value: "products", 
      title: "Products", 
      mobileTitle: "Products",
      icon: Package,
      mobileIcon: Package
    },
    { 
      value: "inquiries", 
      title: "Inquiries", 
      mobileTitle: "Inquiries",
      icon: Mail,
      mobileIcon: Mail
    },
    { 
      value: "categories", 
      title: "Categories", 
      mobileTitle: "Categories",
      icon: Grid3X3,
      mobileIcon: Grid3X3
    },
    { 
      value: "brands", 
      title: "Brands", 
      mobileTitle: "Brands",
      icon: Building,
      mobileIcon: Building
    },
    { 
      value: "portfolio", 
      title: "Portfolio", 
      mobileTitle: "Portfolio",
      icon: Image,
      mobileIcon: Image
    },
    { 
      value: "analytics", 
      title: "Analytics", 
      mobileTitle: "Analytics",
      icon: BarChart3,
      mobileIcon: BarChart3
    },
    { 
      value: "settings", 
      title: "Settings", 
      mobileTitle: "Settings",
      icon: Settings,
      mobileIcon: Settings
    },
  ], []);

  // Render current view
  const renderCurrentView = () => {
    if (isLoading) {
      return <BusinessLoadingLayout navItemCount={menuItems.length} />;
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    const viewProps = {
      business,
      categories,
      products,
      inquiries,
      brands,
      images,
      stats,
      fetchData,
      setActiveSection,
      // OverviewView props
      heroSlidesCount,
      onNavigateToProducts: handleNavigateToProducts,
      onNavigateToInfo: handleNavigateToInfo,
      onNavigateToInquiries: handleNavigateToInquiries,
      onOpenCatalogPreview: handleOpenCatalogPreview,
      viewSeries,
      // ProductsView props
      searchTerm: viewSearchTerm,
      selectedCategory,
      selectedProducts,
      mounted,
      productCurrentPage,
      productItemsPerPage,
      showProductDialog,
      editingProduct,
      productFormData,
      savingProduct,
      newInfoKey,
      newInfoValue,
      onSearchTermChange: handleSearchTermChange,
      onSelectedCategoryChange: handleSelectedCategoryChange,
      onSelectedProductsChange: handleSelectedProductsChange,
      onProductCurrentPageChange: handleProductCurrentPageChange,
      onProductItemsPerPageChange: handleProductItemsPerPageChange,
      onOpenProductDialog: handleOpenProductDialog,
      onCloseProductDialog: handleCloseProductDialog,
      onProductEdit: handleProductEdit,
      onProductDelete: handleProductDelete,
      onProductSave: handleProductSave,
      onProductFormDataChange: handleProductFormDataChange,
      onNewInfoKeyChange: handleNewInfoKeyChange,
      onNewInfoValueChange: handleNewInfoValueChange,
      onAddInfo: handleAddInfo,
      onRemoveInfo: handleRemoveInfo,
      onShare: handleShare,
      onBulkActivate: handleBulkActivate,
      onBulkDeactivate: handleBulkDeactivate,
      onBulkDelete: handleBulkDelete,
      // CategoriesView props
      onAddCategory: handleAddCategory,
      onEditCategory: handleEditCategory,
      onDeleteCategory: handleDeleteCategory,
      onCategorySelect: (categoryId: string) => setSelectedCategory(categoryId),
      showCategoryDialog,
      editingCategory,
      savingCategory,
      categoryFormData,
      onCloseCategoryDialog: () => setShowCategoryDialog(false),
      onSaveCategory: handleSaveCategory,
      onCategoryFormDataChange: (data: Partial<CategoryFormData>) =>
        setCategoryFormData((prev) => ({ ...prev, ...data })),
      // InquiriesView props
      updatingInquiry,
      onInquiryStatusUpdate: handleInquiryStatusUpdate,
      formatDate,
      // BrandsView props
      sectionTitle,
      brandContent: brandContentDraft,
      savingBrand,
      onSectionTitleChange: handleSectionTitleChange,
      onBrandNameChange: handleBrandNameChange,
      onBrandLogoChange: handleBrandLogoChange,
      onBrandLogoUpload: handleBrandLogoUpload,
      onAddBrand: handleAddBrand,
      onEditBrand: handleEditBrand,
      onDeleteBrand: handleDeleteBrand,
      // PortfolioView props
      portfolioContent,
      savingPortfolio,
      onPortfolioContentChange: handlePortfolioContentChange,
      onSavePortfolio: handleSavePortfolio,
      // SettingsView props
      onBusinessUpdate: handleBusinessUpdate,
    };

    switch (activeSection) {
      case "dashboard":
        return <OverviewView {...viewProps} />;
      case "profile":
        if (!business) {
          if (error) {
            return (
              <div className="p-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Business Data</h2>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={fetchData}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            );
          }
          if (isLoading) {
            return <div className="p-6">Loading business data...</div>;
          }
          return (
            <div className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Business Found</h2>
                <p className="text-gray-600 mb-4">
                  No business profile is associated with your account. Please contact support or create a business profile.
                </p>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                >
                  Refresh
                </button>
              </div>
            </div>
          );
        }
        return <BusinessProfile business={business as any} />;
      case "products":
        return <ProductsView {...viewProps} />;
      case "inquiries":
        return <InquiriesView {...viewProps} />;
      case "categories":
        return (
          <>
            <CategoriesView {...viewProps} />
            <BusinessCategoryModal
              isOpen={showCategoryDialog}
              editingCategory={editingCategory}
              categoryFormData={categoryFormData}
              setCategoryFormData={setCategoryFormData}
              categories={categories}
              sectionTitle={sectionTitle}
              onSectionTitleChange={handleSectionTitleChange}
              savingCategory={savingCategory}
              onClose={() => setShowCategoryDialog(false)}
              onSave={handleSaveCategory}
            />
          </>
        );
      case "brands":
        return <BrandsView {...viewProps} />;
      case "portfolio":
        return <PortfolioView {...viewProps} />;
      case "analytics":
        return <AnalyticsView {...viewProps} />;
      case "settings":
        return <SettingsView {...viewProps} />;
      default:
        return <OverviewView {...viewProps} />;
    }
  };

  // Get search placeholder
  const getBusinessSearchPlaceholder = () => {
    switch (activeSection) {
      case "profile":
        return "Search profile...";
      case "products":
        return "Search products...";
      case "inquiries":
        return "Search inquiries...";
      case "categories":
        return "Search categories...";
      case "brands":
        return "Search brands...";
      default:
        return "Search everything...";
    }
  };

  if (loading) {
    return (
      <ThemeProvider>
        <BusinessLoadingLayout navItemCount={menuItems.length} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BusinessErrorBoundary>
        <div className={`min-h-screen `}>
          <BusinessDashboardLayout
            isMobile={false}
            navLinks={menuItems}
            currentView={activeSection}
            onViewChange={(view: string) => setActiveSection(view as BusinessView)}
            onLogout={async () => {
              await logout();
              router.push("/login");
            }}
            onSettings={() => setActiveSection("settings")}
            userName={user?.name || "Business Admin"}
            userEmail={user?.email}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={getBusinessSearchPlaceholder()}
            searchResults={transformedSearchResults}
            recentSearches={transformedRecentSearches}
            onSearchResultSelect={handleTransformedSearchResultSelect}
            middleContent={renderCurrentView()}
            overlayContent={null}
          />
        </div>
      </BusinessErrorBoundary>
    </ThemeProvider>
  );
}

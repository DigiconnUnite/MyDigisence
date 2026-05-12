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
import { BusinessDashboardLayout, BusinessLoadingLayout } from "../components/BusinessLayouts";
import type { Product, Inquiry, Business } from "../types";
import BusinessProfile from "@/components/BusinessProfile";

// View Components
import OverviewView from "../views/OverviewView";
import ProductsView from "../views/ProductsView";
import InquiriesView from "../views/InquiriesView";
import BrandsView from "../views/BrandsView";
import PortfolioView from "../views/PortfolioView";
import AnalyticsView from "../views/AnalyticsView";
import SettingsView from "../views/SettingsView";

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
    isLoading,
    error,
    fetchData,
    cancelLoad,
  } = useBusinessData();

  // State management for views
  const [viewSearchTerm, setViewSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [productItemsPerPage, setProductItemsPerPage] = useState(10);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<any>({});
  const [savingProduct, setSavingProduct] = useState(false);
  const [newInfoKey, setNewInfoKey] = useState("");
  const [newInfoValue, setNewInfoValue] = useState("");
  const [updatingInquiry, setUpdatingInquiry] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [savingBrand, setSavingBrand] = useState(false);
  const [savingPortfolio, setSavingPortfolio] = useState(false);
  const [portfolioContent, setPortfolioContent] = useState<any>({ images: [] });

  // Navigation handlers
  const handleNavigateToProducts = () => setActiveSection("products");
  const handleNavigateToInfo = () => setActiveSection("settings");
  const handleNavigateToInquiries = () => setActiveSection("inquiries");
  const handleOpenCatalogPreview = () => console.log("Catalog preview");
  
  // Form handlers
  const handleSearchTermChange = (term: string) => setViewSearchTerm(term);
  const handleSelectedCategoryChange = (category: string) => setSelectedCategory(category);
  const handleSelectedProductsChange = (products: string[]) => setSelectedProducts(products);
  const handleProductCurrentPageChange = (page: number) => setProductCurrentPage(page);
  const handleProductItemsPerPageChange = (limit: number) => setProductItemsPerPage(limit);
  const handleOpenProductDialog = () => setShowProductDialog(true);
  const handleCloseProductDialog = () => setShowProductDialog(false);
  const handleProductEdit = (product: Product) => setEditingProduct(product);
  const handleProductDelete = (product: Product) => console.log("Delete product:", product);
  const handleProductSave = async () => console.log("Save product");
  const handleProductFormDataChange = (data: any) => setProductFormData(data);
  const handleNewInfoKeyChange = (value: string) => setNewInfoKey(value);
  const handleNewInfoValueChange = (value: string) => setNewInfoValue(value);
  const handleAddInfo = () => console.log("Add info");
  const handleRemoveInfo = (key: string) => console.log("Remove info:", key);
  const handleShare = (product: Product) => console.log("Share product:", product);
  const handleBulkActivate = () => console.log("Bulk activate");
  const handleBulkDeactivate = () => console.log("Bulk deactivate");
  const handleBulkDelete = () => console.log("Bulk delete");
  const handleInquiryStatusUpdate = async (id: string, status: string) => console.log("Update inquiry:", id, status);
  const handleSectionTitleChange = (title: string) => setSectionTitle(title);
  const handlePortfolioContentChange = (content: any) => setPortfolioContent(content);
  const handleSavePortfolio = async () => console.log("Save portfolio");
  const handleBusinessUpdate = async (business: Business) => console.log("Update business:", business);
  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const heroSlidesCount = images.length;
  
  // BrandsView handlers
  const handleBrandNameChange = (value: string) => console.log("Brand name change:", value);
  const handleBrandLogoChange = (value: string) => console.log("Brand logo change:", value);
  const handleBrandLogoUpload = (url: string) => console.log("Brand logo upload:", url);
  const handleAddBrand = () => console.log("Add brand");
  const handleEditBrand = (index: number) => console.log("Edit brand:", index);
  const handleDeleteBrand = (index: number, name: string) => console.log("Delete brand:", index, name);

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

  // Calculate stats for views
  const stats = useMemo(() => ({
    totalProducts: products.length,
    activeProducts: products.filter((p: Product) => p.isActive).length,
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter((i: Inquiry) => i.status === "NEW").length,
    profileViews: 0, // This would come from analytics API
  }), [products, inquiries]);

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
      // InquiriesView props
      updatingInquiry,
      onInquiryStatusUpdate: handleInquiryStatusUpdate,
      formatDate,
      // BrandsView props
      sectionTitle,
      brandContent: { brands: brands },
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
          return <div className="p-6">Loading business data...</div>;
        }
        return <BusinessProfile business={business as any} />;
      case "products":
        return <ProductsView {...viewProps} />;
      case "inquiries":
        return <InquiriesView {...viewProps} />;
      case "categories":
        return <div className="p-6"><h2 className="text-xl font-bold">Categories View</h2><p className="text-gray-600">Categories management coming soon...</p></div>;
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

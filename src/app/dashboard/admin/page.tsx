"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/lib/hooks/useSocket";
import useDebounce from "@/hooks/useDebounce";
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { UnifiedModal } from "@/components/ui/UnifiedModal";

import {
  Building,
  MessageSquare,
  BarChart3,
  TrendingUp,
  UserCheck,
  Home,
  Grid3X3,
  FolderTree,
  MessageCircle,
  LineChart,
  User,
} from "lucide-react";
import CredentialsModal from "./panels/CredentialsModal";
import { useSocketSync } from "./hooks/useSocketSync";
import { useBulkActions } from "./hooks/useBulkActions";
import { useBusinessTable } from "./hooks/useBusinessTable";
import { useProfessionalTable } from "./hooks/useProfessionalTable";
import { useAdminDataLoader } from "./hooks/useAdminDataLoader";
import { requestAdminMutation } from "./hooks/adminMutation";
import { useAdminAuxiliaryState } from "./hooks/useAdminAuxiliaryState";
import { useInquiryActions } from "./hooks/useInquiryActions";
import { useCategoryActions } from "./hooks/useCategoryActions";
import { useBusinessListingActions } from "./hooks/useBusinessListingActions";
import { useRegistrationActions } from "./hooks/useRegistrationActions";
import MainViewRouter from "./components/MainViewRouter";
import {
  AddBusinessForm,
  AddCategoryForm,
  AddProfessionalForm,
  EditBusinessForm,
  EditCategoryForm,
  EditProfessionalForm,
  InquiryAccountForm,
} from "./components/AdminRightPanelForms";
import { AdminDialogs, BusinessListingInquiryDialog } from "./components/AdminDialogs";
import { AdminDashboardLayout, AdminLoadingLayout } from "./components/AdminLayouts";
import AdminSkeletonContent from "./components/AdminSkeletonContent";
import type { AdminStats, Business, Category, Professional } from "./types";

export default function SuperAdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [businessListingInquiries, setBusinessListingInquiries] = useState<
    any[]
  >([]);
  const [registrationInquiries, setRegistrationInquiries] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalBusinesses: 0,
    totalInquiries: 0,
    totalUsers: 0,
    activeBusinesses: 0,
    totalProducts: 0,
    totalActiveProducts: 0,
    totalProfessionals: 0,
    activeProfessionals: 0,
  });
  const [showAddBusiness, setShowAddBusiness] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [showEditBusiness, setShowEditBusiness] = useState(false);
  const [editingProfessional, setEditingProfessional] =
    useState<Professional | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<
    | "add-business"
    | "edit-business"
    | "add-professional"
    | "edit-professional"
    | "add-category"
    | "edit-category"
    | "create-account-from-inquiry"
    | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [deleteBusiness, setDeleteBusiness] = useState<Business | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showDeleteBusinessDialog, setShowDeleteBusinessDialog] = useState(false);
  const [deletingBusiness, setDeletingBusiness] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedBusinessListingInquiry, setSelectedBusinessListingInquiry] =
    useState<any>(null);
  const [
    showBusinessListingInquiryDialog,
    setShowBusinessListingInquiryDialog,
  ] = useState(false);
  
  const [dataFetchError, setDataFetchError] = useState<string | null>(null);
  const [creatingAccount, setCreatingAccount] = useState<string | null>(null);

  const getAdminSearchPlaceholder = () => {
    switch (currentView) {
      case "businesses":
        return "Search businesses by name, email, category...";
      case "professionals":
        return "Search professionals by name, email, headline...";
      case "categories":
        return "Search categories...";
      case "inquiries":
        return "Search contact inquiries...";
      case "registration-requests":
        return "Search registration requests...";
      case "business-listings":
        return "Search business listings...";
      default:
        return "Search dashboard data...";
    }
  };

  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [addBusinessLoading, setAddBusinessLoading] = useState(false);
  const [editBusinessLoading, setEditBusinessLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const [professionalBulkActionLoading, setProfessionalBulkActionLoading] = useState(false);
  const [addProfessionalLoading, setAddProfessionalLoading] = useState(false);
  const [editProfessionalLoading, setEditProfessionalLoading] = useState(false);
  const [professionalToggleLoading, setProfessionalToggleLoading] = useState<string | null>(null);
  const [showProfessionalBulkDeleteDialog, setShowProfessionalBulkDeleteDialog] = useState(false);
  const [deletingProfessional, setDeletingProfessional] = useState(false);
  const [professionalToDelete, setProfessionalToDelete] = useState<Professional | null>(null);
  const [showDeleteProfessionalDialog, setShowDeleteProfessionalDialog] = useState(false);

  // Debounce search term
  const debouncedSearch = useDebounce(searchTerm, 300);

  const {
    businessQuery,
    setBusinessQuery,
    businessData,
    setBusinessData,
    businessLoading,
    selectedBusinessIds,
    setSelectedBusinessIds,
    exportLoading,
    fetchBusinesses,
    handleSort,
    handlePageChange,
    handleLimitChange,
    handleSelectBusiness,
    handleSelectAll,
    handleDeselectAll,
    handleExport,
  } = useBusinessTable({ debouncedSearch, toast });

  const {
    professionalQuery,
    setProfessionalQuery,
    professionalData,
    setProfessionalData,
    professionalLoading,
    selectedProfessionalIds,
    setSelectedProfessionalIds,
    professionalExportLoading,
    professionalSortBy,
    professionalSortOrder,
    fetchProfessionals,
    handleProfessionalSort,
    handleProfessionalPageChange,
    handleProfessionalLimitChange,
    handleSelectProfessional,
    handleSelectAllProfessionals,
    handleDeselectAllProfessionals,
    handleProfessionalExport,
  } = useProfessionalTable({ debouncedSearch, currentView, toast });
  
  // Professional form state
  
  const {
    inquiryToDelete,
    setInquiryToDelete,
    showDeleteInquiryDialog,
    setShowDeleteInquiryDialog,
    selectedInquiries,
    setSelectedInquiries,
    inquiryQuery,
    setInquiryQuery,
    inquiryPagination,
    setInquiryPagination,
    selectedRegistrations,
    setSelectedRegistrations,
    selectedRegistrationInquiry,
    setSelectedRegistrationInquiry,
    showRegistrationInquiryDialog,
    setShowRegistrationInquiryDialog,
    registrationQuery,
    setRegistrationQuery,
    registrationPagination,
    setRegistrationPagination,
    selectedCategories,
    setSelectedCategories,
    categoryQuery,
    setCategoryQuery,
    categoryPagination,
    setCategoryPagination,
    categoryToDelete,
    setCategoryToDelete,
    showDeleteCategoryDialog,
    setShowDeleteCategoryDialog,
    businessListingQuery,
    setBusinessListingQuery,
    businessListingPagination,
    setBusinessListingPagination,
    selectedBusinessListings,
    setSelectedBusinessListings,
  } = useAdminAuxiliaryState();
  
  // Reject inquiry dialog state
  const [showRejectInquiryDialog, setShowRejectInquiryDialog] = useState(false);
  const [inquiryToReject, setInquiryToReject] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  const {
    handleViewInquiry,
    handleReplyInquiry,
    handleDeleteInquiry,
    confirmDeleteInquiry,
    handleSelectAllInquiries,
    handleDeselectAllInquiries,
    handleInquiryBulkActivate,
    handleInquiryBulkSuspend,
    handleInquiryBulkDelete,
  } = useInquiryActions({
    inquiries,
    setInquiries,
    selectedInquiries,
    setSelectedInquiries,
    inquiryToDelete,
    setInquiryToDelete,
    setShowDeleteInquiryDialog,
    setShowBulkDeleteDialog,
    toast,
  });

  const {
    handleUpdateBusinessListingInquiry,
  } = useBusinessListingActions({
    setBusinessListingInquiries,
    setShowBusinessListingInquiryDialog,
    setSelectedBusinessListingInquiry,
    toast,
  });



// Responsive design hook
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);


  // Socket.IO connection for real-time updates
  const { socket, isConnected } = useSocket();

  // Real-time updates from Socket.IO
  useSocketSync(socket, isConnected, {
    setBusinesses,
    setBusinessData,
    setProfessionals,
    setProfessionalData,
    setRegistrationInquiries,
    setStats,
  });

  // Authentication check
  useEffect(() => {
    if (!loading && (!user || user.role !== "SUPER_ADMIN")) {
      router.push("/login");
      return;
    }
  }, [user, loading, router]);

  // Memoized filtered data (for backwards compatibility)
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.category?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && business.isActive) ||
        (filterStatus === "inactive" && !business.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [businesses, searchTerm, filterStatus]);

  const filteredCategories = useMemo(() => {
    // Ensure categories is an array before filtering
    const categoriesArray = Array.isArray(categories) ? categories : [];
    return categoriesArray.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const filteredStats = useMemo(() => {
    return {
      total: filteredBusinesses.length,
      active: filteredBusinesses.filter((b) => b.isActive).length,
      inactive: filteredBusinesses.filter((b) => !b.isActive).length,
    };
  }, [filteredBusinesses]);

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (businessQuery.sortBy !== column) return <div className="w-4 h-4 opacity-30">↕</div>;
    return businessQuery.sortOrder === 'asc' ? 
      <div className="w-4 h-4">↑</div> : 
      <div className="w-4 h-4">↓</div>;
  };

  // Get professional sort icon
  const getProfessionalSortIcon = (column: string) => {
    if (professionalSortBy !== column) return <div className="w-4 h-4 opacity-30">↕</div>;
    return professionalSortOrder === 'asc' ? 
      <div className="w-4 h-4">↑</div> : 
      <div className="w-4 h-4">↓</div>;
  };

  // Handle toggle professional status
  const handleToggleProfessionalStatus = useCallback(
    async (e: React.MouseEvent, professional: Professional) => {
      e.preventDefault();
      setProfessionalToggleLoading(professional.id);
      const result = await requestAdminMutation(
        `/api/admin/professionals/${professional.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !professional.isActive }),
        },
        'Failed to toggle status'
      );

      if (result.ok) {
        setProfessionalData((prev) =>
          prev
            ? {
                ...prev,
                professionals: prev.professionals.map((prof) =>
                  prof.id === professional.id
                    ? { ...prof, isActive: !prof.isActive }
                    : prof
                ),
              }
            : null
        );
        setStats((prev) => ({
          ...prev,
          activeProfessionals: !professional.isActive
            ? prev.activeProfessionals + 1
            : prev.activeProfessionals - 1,
        }));
        fetchProfessionals();
        toast({
          title: 'Success',
          description: `Professional ${!professional.isActive ? 'activated' : 'deactivated'} successfully`,
        });
      } else {
        toast({ title: 'Error', description: `Failed to update status: ${result.error || 'Unknown error'}`, variant: 'destructive' });
      }

      setProfessionalToggleLoading(null);
    },
    [toast, fetchProfessionals]
  );
  
  // Handle delete professional with dialog
  const handleDeleteProfessional = useCallback(
    async (professional: Professional) => {
      setProfessionalToDelete(professional);
      setShowDeleteProfessionalDialog(true);
    },
    []
  );
  
  // Confirm delete professional
  const confirmDeleteProfessional = useCallback(async () => {
    if (!professionalToDelete) return;
    
    setDeletingProfessional(true);
    setShowDeleteProfessionalDialog(false);
    
    const result = await requestAdminMutation(
      `/api/admin/professionals/${professionalToDelete.id}`,
      { method: 'DELETE' },
      'Failed to delete professional'
    );

    if (result.ok) {
      setProfessionalData((prev) =>
        prev
          ? {
              ...prev,
              professionals: prev.professionals.filter(
                (prof) => prof.id !== professionalToDelete.id
              ),
              pagination: {
                ...prev.pagination,
                totalItems: prev.pagination.totalItems - 1,
              },
            }
          : null
      );
      setStats((prev) => ({
        ...prev,
        totalProfessionals: prev.totalProfessionals - 1,
        activeProfessionals: professionalToDelete.isActive ? prev.activeProfessionals - 1 : prev.activeProfessionals,
      }));
      fetchProfessionals();
      toast({
        title: 'Success',
        description: 'Professional deleted successfully',
      });
    } else {
      toast({ title: 'Error', description: `Failed to delete professional: ${result.error || 'Unknown error'}`, variant: 'destructive' });
    }

    setDeletingProfessional(false);
    setProfessionalToDelete(null);
  }, [professionalToDelete, toast, fetchProfessionals]);

  const { fetchData } = useAdminDataLoader({
    setIsLoading,
    setDataFetchError,
    setBusinesses,
    setCategories,
    setInquiries,
    setProfessionals,
    setBusinessListingInquiries,
    setRegistrationInquiries,
    setStats,
  });

  // Business bulk actions
  const businessBulkActions = useBulkActions('business', selectedBusinessIds, {
    fetchData,
    fetchEntities: fetchBusinesses,
    setSelectedIds: setSelectedBusinessIds,
    setLoading: setBulkActionLoading,
    setShowDeleteDialog: setShowBulkDeleteDialog,
  });

  // Professional bulk actions
  const professionalBulkActions = useBulkActions('professional', selectedProfessionalIds, {
    fetchData,
    fetchEntities: fetchProfessionals,
    setSelectedIds: setSelectedProfessionalIds,
    setLoading: setProfessionalBulkActionLoading,
    setShowDeleteDialog: setShowProfessionalBulkDeleteDialog,
  });

  const {
    handleAddCategory,
    handleEditCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    confirmDeleteCategory,
  } = useCategoryActions({
    editingCategory,
    setEditingCategory,
    categoryToDelete,
    setCategoryToDelete,
    setCategories,
    setShowDeleteCategoryDialog,
    setShowRightPanel,
    setRightPanelContent,
    fetchData,
    queryClient,
    toast,
  });

  // Generate password utility - cryptographically secure
  const generatePassword = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "Adm@";
    const randomValues = new Uint32Array(12);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(randomValues[i] % chars.length);
    }
    return password;
  }, []);

  const {
    handleCreateAccountFromInquiry,
    handleCreateAccountFromInquiryWithSidebar,
    handleRejectInquiry,
    confirmRejectInquiry,
  } = useRegistrationActions({
    setCreatingAccount,
    setRegistrationInquiries,
    setEditingBusiness,
    setEditingProfessional,
    setRightPanelContent,
    setShowRightPanel,
    setInquiryToReject,
    setRejectReason,
    setShowRejectInquiryDialog,
    inquiryToReject,
    rejectReason,
    fetchData,
    toast,
  });

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Credentials modal state
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    name?: string;
    type?: 'business' | 'professional';
  } | null>(null);

  // Generate credentials utility
  const handleGenerateCredentials = useCallback(
    (businessName: string, adminName: string) => {
      const baseUsername =
        adminName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const username = `${baseUsername}_${Date.now().toString().slice(-4)}`;
      const password = generatePassword();
      setGeneratedPassword(password);
      setGeneratedUsername(username);
    },
    [generatePassword]
  );

  // Handle add business with improved error handling
  const handleAddBusiness = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAddBusinessLoading(true);
      const formData = new FormData(e.currentTarget);

      const manualUsername = formData.get("username") as string;
      const manualPassword = formData.get("password") as string;

      const businessData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: manualPassword || generatedPassword || generatePassword(),
        adminName: formData.get("adminName") as string,
        categoryId: formData.get("categoryId") as string,
        description: (formData.get("description") as string) || "",
        address: (formData.get("address") as string) || "",
        phone: (formData.get("phone") as string) || "",
        website: (formData.get("website") as string) || "",
      };

      const result = await requestAdminMutation<any>(
        "/api/admin/businesses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(businessData),
        },
        "Failed to create business"
      );

      if (result.ok) {
        setCredentials({
          email: businessData.email,
          password: businessData.password,
          name: businessData.name,
          type: 'business'
        });
        setShowCredentialsModal(true);
        setShowRightPanel(false);
        setRightPanelContent(null);
        setGeneratedPassword("");
        setGeneratedUsername("");
        if (e.currentTarget) {
          e.currentTarget.reset();
        }
        fetchBusinesses();
        fetchData();
      } else {
        console.error("Business creation failed:", result.error);
        toast({
          title: "Error",
          description: `Failed to create business: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }

      setAddBusinessLoading(false);
    },
    [generatedPassword, generatePassword, toast]
  );

  // Handle edit business
  const handleEditBusiness = useCallback((business: Business) => {
    setEditingBusiness(business);
    setRightPanelContent("edit-business");
    setShowRightPanel(true);
  }, []);

  // Handle update business with improved error handling
  const handleUpdateBusiness = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingBusiness) return;

      setEditBusinessLoading(true);
      const formData = new FormData(e.currentTarget);

      const updateData = {
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || "",
        logo: (formData.get("logo") as string) || "",
        address: (formData.get("address") as string) || "",
        phone: (formData.get("phone") as string) || "",
        email: formData.get("email") as string,
        website: (formData.get("website") as string) || "",
        categoryId: formData.get("categoryId") as string,
      };

      const result = await requestAdminMutation(
        `/api/admin/businesses/${editingBusiness.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
        "Failed to update business"
      );

      if (result.ok) {
        setBusinesses((prev) =>
          prev.map((biz) =>
            biz.id === editingBusiness.id
              ? { ...biz, ...updateData }
              : biz
          )
        );

        fetchBusinesses();

        setShowRightPanel(false);
        setRightPanelContent(null);
        toast({
          title: "Success",
          description: "Business updated successfully!",
        });
      } else {
        console.error("Update failed:", result.error);
        toast({
          title: "Error",
          description: `Failed to update business: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }

      setEditBusinessLoading(false);
    },
    [editingBusiness, toast, fetchBusinesses]
  );

  // Handle delete business with improved error handling
  const handleDeleteBusiness = useCallback(
    async (business: Business) => {
      // Show dialog instead of browser alert
      setDeleteBusiness(business);
      setShowDeleteBusinessDialog(true);
    },
    []
  );

  // Confirm and perform delete business
  const confirmDeleteBusiness = useCallback(async () => {
    if (!deleteBusiness) return;
    
    setDeletingBusiness(true);
    setShowDeleteBusinessDialog(false);
    
    const result = await requestAdminMutation(
      `/api/admin/businesses/${deleteBusiness.id}`,
      {
        method: "DELETE",
      },
      "Failed to delete business"
    );

    if (result.ok) {
      setBusinesses((prev) => {
        const updatedBusinesses = prev.filter((biz) => biz.id !== deleteBusiness.id);
        return updatedBusinesses;
      });

      setStats((prev) => ({
        ...prev,
        totalBusinesses: prev.totalBusinesses - 1,
        totalUsers: prev.totalUsers - 1,
        activeBusinesses: deleteBusiness.isActive
          ? prev.activeBusinesses - 1
          : prev.activeBusinesses,
        totalProducts: prev.totalProducts - deleteBusiness._count.products,
        totalActiveProducts: deleteBusiness.isActive
          ? prev.totalActiveProducts - deleteBusiness._count.products
          : prev.totalActiveProducts,
      }));

      fetchBusinesses();

      toast({
        title: "Success",
        description: "Business and associated user deleted successfully",
      });
    } else {
      console.error("Business deletion failed:", result.error);
      toast({
        title: "Error",
        description: `Failed to delete business: ${result.error || "Unknown error"}`,
        variant: "destructive",
      });
    }

    setDeletingBusiness(false);
    setDeleteBusiness(null);
  }, [deleteBusiness, toast, fetchBusinesses]);

  // Handle toggle business status
  const handleToggleBusinessStatus = useCallback(
    async (e: React.MouseEvent, business: Business) => {
      e.preventDefault();
      setToggleLoading(business.id);
      const result = await requestAdminMutation(
        `/api/admin/businesses/${business.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !business.isActive }),
        },
        "Failed to update business status"
      );

      if (result.ok) {
        setBusinesses((prev) =>
          prev.map((biz) =>
            biz.id === business.id
              ? { ...biz, isActive: !biz.isActive }
              : biz
          )
        );

        setStats((prev) => ({
          ...prev,
          activeBusinesses: !business.isActive
            ? prev.activeBusinesses + 1
            : prev.activeBusinesses - 1,
          totalActiveProducts: !business.isActive
            ? prev.totalActiveProducts + business._count.products
            : prev.totalActiveProducts - business._count.products,
        }));

        fetchBusinesses();

        toast({
          title: "Success",
          description: `Business ${!business.isActive ? 'activated' : 'suspended'} successfully`,
        });
      } else {
        console.error("Toggle failed:", result.error);
        toast({
          title: "Error",
          description: `Failed to update business status: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }

      setToggleLoading(null);
    },
    [toast, fetchBusinesses]
  );

  // Handle duplicate business
  const handleDuplicateBusiness = useCallback(
    async (business: Business) => {
      if (
        !confirm(
          `Create a duplicate of "${business.name}"? A new business with a new admin account will be created.`
        )
      ) {
        return;
      }

      const result = await requestAdminMutation<any>(
        `/api/admin/businesses/${business.id}/duplicate`,
        {
          method: "POST",
        },
        "Failed to duplicate business"
      );

      if (result.ok && result.data) {
        fetchBusinesses();
        fetchData();

        setCredentials({
          email: result.data.loginCredentials.email,
          password: result.data.loginCredentials.password,
          name: result.data.name,
          type: 'business'
        });
        setShowCredentialsModal(true);
      } else {
        console.error("Business duplication failed:", result.ok ? "Missing duplicate response payload" : result.error);
        toast({
          title: "Error",
          description: `Failed to duplicate business: ${result.ok ? "Unknown error" : result.error}`,
          variant: "destructive",
        });
      }
    },
    [toast, fetchBusinesses, fetchData]
  );

  // Handle edit professional
  const handleEditProfessional = useCallback((professional: Professional) => {
    setEditingProfessional(professional);
    setRightPanelContent("edit-professional");
    setShowRightPanel(true);
  }, []);


  const handleAddProfessional = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const manualPassword = formData.get("password") as string;

      const professionalData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: manualPassword || generatedPassword || generatePassword(),
        adminName: formData.get("adminName") as string,
        phone: formData.get("phone") as string,
      };

      const result = await requestAdminMutation<any>(
        "/api/admin/professionals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(professionalData),
        },
        "Failed to create professional account"
      );

      if (result.ok) {
        setCredentials({
          email: professionalData.email,
          password: professionalData.password,
          name: professionalData.name,
          type: 'professional'
        });
        setShowCredentialsModal(true);
        setShowRightPanel(false);
        setRightPanelContent(null);
        setGeneratedPassword("");
        setGeneratedUsername("");
        if (e.currentTarget) {
          e.currentTarget.reset();
        }
        fetchData();
        fetchProfessionals();
        setProfessionalQuery(prev => ({ ...prev, page: 1 }));
      } else {
        console.error("Professional creation failed:", result.error);
        toast({
          title: "Error",
          description: `Failed to create professional account: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }
    },
    [generatedPassword, generatePassword, toast]
  );

  // Handle update professional with improved error handling
  const handleUpdateProfessional = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingProfessional) return;

      setIsLoading(true);
      const formData = new FormData(e.currentTarget);

      const updateData = {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
      };

      const result = await requestAdminMutation(
        `/api/admin/professionals/${editingProfessional.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
        "Failed to update professional account"
      );

      if (result.ok) {
        setProfessionalData((prev) =>
          prev
            ? {
                ...prev,
                professionals: prev.professionals.map((prof) =>
                  prof.id === editingProfessional.id
                    ? { ...prof, ...updateData }
                    : prof
                ),
              }
            : null
        );

        fetchProfessionals();

        setShowRightPanel(false);
        setRightPanelContent(null);
        toast({
          title: "Success",
          description: "Professional account updated successfully!",
        });
      } else {
        console.error("Update failed:", result.error);
        toast({
          title: "Error",
          description: `Failed to update professional account: ${result.error || "Unknown error"}`,
          variant: "destructive",
        });
      }

      setIsLoading(false);
    },
    [editingProfessional, toast, fetchProfessionals]
  );

  // Helper function to get right panel title
  const getRightPanelTitle = () => {
    switch (rightPanelContent) {
      case "add-business":
        return "Add New Business";
      case "edit-business":
        return "Edit Business";
      case "add-professional":
        return "Add Professional";
      case "edit-professional":
        return "Edit Professional";
      case "add-category":
        return "Add Category";
      case "edit-category":
        return "Edit Category";
      case "create-account-from-inquiry":
        return "Create Account";
      default:
        return "Panel";
    }
  };

  // Helper function to get right panel description
  const getRightPanelDescription = () => {
    switch (rightPanelContent) {
      case "add-business":
        return "Create a new business account and listing.";
      case "edit-business":
        return "Update business details and category.";
      case "add-professional":
        return "Register a new professional profile.";
      case "edit-professional":
        return "Update professional details.";
      case "add-category":
        return "Create a new business category.";
      case "edit-category":
        return "Update category details.";
      case "create-account-from-inquiry":
        return "Complete account setup from registration request.";
      default:
        return "";
    }
  };

  // Common close handler
  const closePanel = () => {
    setShowRightPanel(false);
    setRightPanelContent(null);
    setGeneratedPassword("");
    setGeneratedUsername("");
    setEditingBusiness(null);
    setEditingProfessional(null);
    setCreatingAccount(null);
  };

  // Helper function to get right panel footer
  const getRightPanelFooter = () => {
    const formId = getFormId();
    
    switch (rightPanelContent) {
      case "add-business":
      case "edit-business":
        return (
          <>
            <Button type="button" variant="outline" onClick={closePanel} className="rounded-md w-auto flex-1">
              Cancel
            </Button>
            <Button type="submit" form={formId} disabled={rightPanelContent === "add-business" ? addBusinessLoading : editBusinessLoading} className="rounded-md w-auto flex-1 bg-black text-white hover:bg-gray-800">
              {rightPanelContent === "add-business" ? (
                addBusinessLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Business"
                )
              ) : (
                editBusinessLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )
              )}
            </Button>
          </>
        );
      case "add-professional":
      case "edit-professional":
        return (
          <>
            <Button type="button" variant="outline" onClick={closePanel} className="rounded-md w-auto flex-1">
              Cancel
            </Button>
            <Button type="submit" form={formId} className="rounded-md w-auto flex-1 bg-black text-white hover:bg-gray-800">
              {rightPanelContent === "add-professional" ? "Create Profile" : "Save Changes"}
            </Button>
          </>
        );
      case "add-category":
      case "edit-category":
        return (
          <>
            <Button type="button" variant="outline" onClick={closePanel} className="rounded-md w-auto flex-1">
              Cancel
            </Button>
            <Button type="submit" form={formId} className="rounded-md w-auto flex-1 bg-black text-white hover:bg-gray-800">
              {rightPanelContent === "add-category" ? "Create Category" : "Update Category"}
            </Button>
          </>
        );
      case "create-account-from-inquiry":
        return (
          <>
            <Button type="button" variant="outline" onClick={closePanel} className="rounded-md w-auto flex-1" disabled={creatingAccount !== null}>
              Cancel
            </Button>
            <Button type="submit" form={formId} className="rounded-md w-auto flex-1 bg-green-600 text-white hover:bg-green-700" disabled={creatingAccount !== null}>
              {creatingAccount ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  // Helper function to get form ID
  const getFormId = () => {
    switch (rightPanelContent) {
      case "add-business":
        return "add-business-form";
      case "edit-business":
        return "edit-business-form";
      case "add-professional":
        return "add-professional-form";
      case "edit-professional":
        return "edit-professional-form";
      case "add-category":
        return "add-category-form";
      case "edit-category":
        return "edit-category-form";
      case "create-account-from-inquiry":
        return "inquiry-account-form";
      default:
        return undefined;
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      mobileIcon: Home,
      value: "dashboard",
      mobileTitle: "Home",
    },
    {
      title: "Businesses",
      icon: Building,
      mobileIcon: Grid3X3,
      value: "businesses",
      mobileTitle: "Business",
    },
    {
      title: "Professionals",
      icon: User,
      mobileIcon: User,
      value: "professionals",
      mobileTitle: "Professional",
    },
    {
      title: "Categories",
      icon: FolderTree,
      mobileIcon: FolderTree,
      value: "categories",
      mobileTitle: "Category",
    },
    {
      title: "Contact Inquiry",
      icon: MessageSquare,
      mobileIcon: MessageCircle,
      value: "inquiries",
      mobileTitle: "Inquiry",
    },
    {
      title: "Registration Requests",
      icon: UserCheck,
      mobileIcon: UserCheck,
      value: "registration-requests",
      mobileTitle: "Registrations",
    },
    {
      title: "Analytics",
      icon: TrendingUp,
      mobileIcon: LineChart,
      value: "analytics",
      mobileTitle: "Analytics",
    },
  ];
  const renderMiddleContent = () => (
    <MainViewRouter
      currentView={currentView}
      isLoading={isLoading}
      stats={stats}
      businesses={businesses}
      professionals={professionals}
      registrationInquiries={registrationInquiries}
      setRightPanelContent={setRightPanelContent}
      setShowRightPanel={setShowRightPanel}
      dataFetchError={dataFetchError}
      fetchData={fetchData}
      fetchBusinesses={fetchBusinesses}
      businessQuery={businessQuery}
      setBusinessQuery={setBusinessQuery}
      businessData={businessData}
      filteredBusinesses={filteredBusinesses}
      handleExport={handleExport}
      exportLoading={exportLoading}
      addBusinessLoading={addBusinessLoading}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedBusinessIds={selectedBusinessIds}
      handleSelectAll={handleSelectAll}
      handleDeselectAll={handleDeselectAll}
      handleSelectBusiness={handleSelectBusiness}
      businessBulkActions={businessBulkActions}
      businessLoading={businessLoading}
      toggleLoading={toggleLoading}
      handleToggleBusinessStatus={handleToggleBusinessStatus}
      handleEditBusiness={handleEditBusiness}
      handleDeleteBusiness={handleDeleteBusiness}
      handlePageChange={handlePageChange}
      handleLimitChange={handleLimitChange}
      fetchProfessionals={fetchProfessionals}
      professionalQuery={professionalQuery}
      setProfessionalQuery={setProfessionalQuery}
      professionalData={professionalData}
      handleProfessionalExport={handleProfessionalExport}
      professionalExportLoading={professionalExportLoading}
      addProfessionalLoading={addProfessionalLoading}
      selectedProfessionalIds={selectedProfessionalIds}
      handleSelectAllProfessionals={handleSelectAllProfessionals}
      handleDeselectAllProfessionals={handleDeselectAllProfessionals}
      handleSelectProfessional={handleSelectProfessional}
      professionalBulkActions={professionalBulkActions}
      professionalLoading={professionalLoading}
      handleProfessionalSort={handleProfessionalSort}
      getProfessionalSortIcon={getProfessionalSortIcon}
      professionalToggleLoading={professionalToggleLoading}
      handleToggleProfessionalStatus={handleToggleProfessionalStatus}
      handleEditProfessional={handleEditProfessional}
      handleDeleteProfessional={handleDeleteProfessional}
      handleProfessionalPageChange={handleProfessionalPageChange}
      handleProfessionalLimitChange={handleProfessionalLimitChange}
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      categories={categories}
      filteredCategories={filteredCategories}
      toast={toast}
      inquiries={inquiries}
      selectedInquiries={selectedInquiries}
      handleSelectAllInquiries={handleSelectAllInquiries}
      handleDeselectAllInquiries={handleDeselectAllInquiries}
      handleInquiryBulkActivate={handleInquiryBulkActivate}
      handleInquiryBulkSuspend={handleInquiryBulkSuspend}
      handleInquiryBulkDelete={handleInquiryBulkDelete}
      handleViewInquiry={handleViewInquiry}
      handleReplyInquiry={handleReplyInquiry}
      handleDeleteInquiry={handleDeleteInquiry}
      inquiryQuery={inquiryQuery}
      setInquiryQuery={setInquiryQuery}
      inquiryPagination={inquiryPagination}
      selectedRegistrationInquiry={selectedRegistrationInquiry}
      setSelectedRegistrationInquiry={setSelectedRegistrationInquiry}
      showRegistrationInquiryDialog={showRegistrationInquiryDialog}
      setShowRegistrationInquiryDialog={setShowRegistrationInquiryDialog}
      handleCreateAccountFromInquiryWithSidebar={handleCreateAccountFromInquiryWithSidebar}
      handleRejectInquiry={handleRejectInquiry}
      confirmRejectInquiry={confirmRejectInquiry}
      creatingAccount={creatingAccount}
      inquiryToReject={inquiryToReject}
      rejectReason={rejectReason}
      setRejectReason={setRejectReason}
      setInquiryToReject={setInquiryToReject}
      showRejectInquiryDialog={showRejectInquiryDialog}
      setShowRejectInquiryDialog={setShowRejectInquiryDialog}
      businessListingInquiries={businessListingInquiries}
      selectedBusinessListings={selectedBusinessListings}
      setSelectedBusinessListings={setSelectedBusinessListings}
      setSelectedBusinessListingInquiry={setSelectedBusinessListingInquiry}
      setShowBusinessListingInquiryDialog={setShowBusinessListingInquiryDialog}
      handleEditCategory={handleEditCategory}
      handleDeleteCategory={handleDeleteCategory}
    />
  );

    
const renderRightPanel = () => {
  if (!showRightPanel) return null;

  const safeCategories = Array.isArray(categories) ? categories : [];

  if (rightPanelContent === "add-business") {
    return (
      <AddBusinessForm
        categories={categories}
        handleAddBusiness={handleAddBusiness}
        generatedUsername={generatedUsername}
        setGeneratedUsername={setGeneratedUsername}
        generatedPassword={generatedPassword}
        setGeneratedPassword={setGeneratedPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        generatePassword={generatePassword}
      />
    );
  }

  if (rightPanelContent === "edit-business" && editingBusiness) {
    return (
      <EditBusinessForm
        editingBusiness={editingBusiness}
        categories={categories}
        handleUpdateBusiness={handleUpdateBusiness}
      />
    );
  }

  if (rightPanelContent === "add-professional") {
    return (
      <AddProfessionalForm
        handleAddProfessional={handleAddProfessional}
        generatedUsername={generatedUsername}
        setGeneratedUsername={setGeneratedUsername}
        generatedPassword={generatedPassword}
        setGeneratedPassword={setGeneratedPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        generatePassword={generatePassword}
      />
    );
  }

  if (rightPanelContent === "edit-professional" && editingProfessional) {
    return (
      <EditProfessionalForm
        editingProfessional={editingProfessional}
        handleUpdateProfessional={handleUpdateProfessional}
      />
    );
  }

  if (rightPanelContent === "add-category") {
    return <AddCategoryForm categories={categories} handleAddCategory={handleAddCategory} />;
  }

  if (rightPanelContent === "edit-category" && editingCategory) {
    return (
      <EditCategoryForm
        editingCategory={editingCategory}
        categories={safeCategories}
        handleUpdateCategory={handleUpdateCategory}
      />
    );
  }

  if (rightPanelContent === "create-account-from-inquiry" && (editingBusiness || editingProfessional)) {
    const inquiry = editingBusiness || editingProfessional;
    if (!inquiry) return null;

    return (
      <InquiryAccountForm
        inquiry={inquiry}
        isBusiness={!!editingBusiness}
        categories={safeCategories}
        setCreatingAccount={setCreatingAccount}
        setRegistrationInquiries={setRegistrationInquiries}
        fetchData={fetchData}
        closePanel={closePanel}
        toast={toast}
        requestAdminMutation={requestAdminMutation}
        generatedUsername={generatedUsername}
        setGeneratedUsername={setGeneratedUsername}
        generatedPassword={generatedPassword}
        setGeneratedPassword={setGeneratedPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        generatePassword={generatePassword}
      />
    );
  }

  return null;
};



  if (loading || isLoading) {
    return (
      <AdminLoadingLayout
        isMobile={isMobile}
        skeletonContent={<AdminSkeletonContent currentView={currentView} />}
      />
    );
  }

  if (!user || user.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <AdminDashboardLayout
      isMobile={isMobile}
      navLinks={menuItems}
      currentView={currentView}
      onViewChange={setCurrentView}
      onLogout={async () => {
        await logout();
        router.push("/login");
      }}
      onSettings={() => setCurrentView("settings")}
      userName={user?.name || "Super Admin"}
      userEmail={user?.email}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder={getAdminSearchPlaceholder()}
      middleContent={renderMiddleContent()}
      overlayContent={
        <>
          <UnifiedModal
            isOpen={showRightPanel}
            onClose={(open) => {
              if (!open) {
                setShowRightPanel(false);
                setRightPanelContent(null);
                setGeneratedPassword("");
                setGeneratedUsername("");
              }
            }}
            title={getRightPanelTitle()}
            description={getRightPanelDescription()}
            footer={getRightPanelFooter()}
          >
            {renderRightPanel()}
          </UnifiedModal>

          <BusinessListingInquiryDialog
            showBusinessListingInquiryDialog={showBusinessListingInquiryDialog}
            setShowBusinessListingInquiryDialog={setShowBusinessListingInquiryDialog}
            selectedBusinessListingInquiry={selectedBusinessListingInquiry}
            setSelectedBusinessListingInquiry={setSelectedBusinessListingInquiry}
            handleUpdateBusinessListingInquiry={handleUpdateBusinessListingInquiry}
          />

          <AdminDialogs
            showBulkDeleteDialog={showBulkDeleteDialog}
            setShowBulkDeleteDialog={setShowBulkDeleteDialog}
            selectedBusinessIds={selectedBusinessIds}
            businessBulkActions={businessBulkActions}
            bulkActionLoading={bulkActionLoading}
            showProfessionalBulkDeleteDialog={showProfessionalBulkDeleteDialog}
            setShowProfessionalBulkDeleteDialog={setShowProfessionalBulkDeleteDialog}
            selectedProfessionalIds={selectedProfessionalIds}
            professionalBulkActions={professionalBulkActions}
            professionalBulkActionLoading={professionalBulkActionLoading}
            showDeleteBusinessDialog={showDeleteBusinessDialog}
            setShowDeleteBusinessDialog={setShowDeleteBusinessDialog}
            deleteBusiness={deleteBusiness}
            confirmDeleteBusiness={confirmDeleteBusiness}
            setDeleteBusiness={setDeleteBusiness}
            deletingBusiness={deletingBusiness}
            showDeleteProfessionalDialog={showDeleteProfessionalDialog}
            setShowDeleteProfessionalDialog={setShowDeleteProfessionalDialog}
            professionalToDelete={professionalToDelete}
            confirmDeleteProfessional={confirmDeleteProfessional}
            setProfessionalToDelete={setProfessionalToDelete}
            deletingProfessional={deletingProfessional}
            showDeleteCategoryDialog={showDeleteCategoryDialog}
            setShowDeleteCategoryDialog={setShowDeleteCategoryDialog}
            categoryToDelete={categoryToDelete}
            confirmDeleteCategory={confirmDeleteCategory}
            setCategoryToDelete={setCategoryToDelete}
            showRejectInquiryDialog={showRejectInquiryDialog}
            setShowRejectInquiryDialog={setShowRejectInquiryDialog}
            inquiryToReject={inquiryToReject}
            setInquiryToReject={setInquiryToReject}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            confirmRejectInquiry={confirmRejectInquiry}
            creatingAccount={creatingAccount}
            showRegistrationInquiryDialog={showRegistrationInquiryDialog}
            setShowRegistrationInquiryDialog={setShowRegistrationInquiryDialog}
            selectedRegistrationInquiry={selectedRegistrationInquiry}
            setSelectedRegistrationInquiry={setSelectedRegistrationInquiry}
          />

          <CredentialsModal
            isOpen={showCredentialsModal}
            onClose={() => setShowCredentialsModal(false)}
            credentials={credentials}
          />
        </>
      }
    />
  );
}

import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardRouter } from "../hooks/useDashboardRouter";
import { useDashboardSearch } from "../hooks/useDashboardSearch";
import type { AdminView, SettingsTabId } from "./config/searchIndex";
import { ADMIN_SEARCH_INDEX } from "./config/searchIndex";
import type { AdminStats, Business, Category, Professional } from "./types";
import type { HeaderSearchResult } from "../components/SharedDashboardHeader";

const VALID_ADMIN_VIEWS: AdminView[] = [
  "dashboard",
  "businesses",
  "professionals",
  "blogs",
  "categories",
  "inquiries",
  "registration-requests",
  "business-listings",
  "analytics",
  "settings",
];

const VALID_SETTINGS_TABS: SettingsTabId[] = ["general", "security", "notifications"];
const RECENT_SEARCHES_STORAGE_KEY = "digisence-admin-recent-searches";

function generatePassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "Adm@";
  const randomValues = new Uint32Array(12);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(randomValues[i] % chars.length);
  }
  return password;
}

export function useAdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Router
  const { currentView, setCurrentView } = useDashboardRouter(VALID_ADMIN_VIEWS, "dashboard");
  const [settingsTab, setSettingsTab] = useState<SettingsTabId>("general");
  const [settingsSection, setSettingsSection] = useState<string | null>(null);

  // Data state
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [businessListingInquiries, setBusinessListingInquiries] = useState<any[]>([]);
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
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetchError, setDataFetchError] = useState<string | null>(null);

  // Search
  const {
    query: commandSearchTerm,
    setQuery: setCommandSearchTerm,
    displayResults: headerSearchResults,
    addRecent,
  } = useDashboardSearch(ADMIN_SEARCH_INDEX, {
    recentStorageKey: RECENT_SEARCHES_STORAGE_KEY,
    maxRecent: 8,
  });

  const handleSearchResultSelect = useCallback(
    (result: HeaderSearchResult) => {
      addRecent(result as any);
      setCurrentView(result.view || "dashboard");
      if (result.view === "settings" && result.tab && VALID_SETTINGS_TABS.includes(result.tab as SettingsTabId)) {
        setSettingsTab(result.tab as SettingsTabId);
      }
      setSettingsSection(result.sectionId ?? null);
      setCommandSearchTerm("");
    },
    [addRecent, setCurrentView]
  );

  // Right panel state
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
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [creatingAccount, setCreatingAccount] = useState<string | null>(null);

  // Credentials
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    name?: string;
    type?: "business" | "professional";
  } | null>(null);

  // Dialogs
  const [deleteBusiness, setDeleteBusiness] = useState<Business | null>(null);
  const [showDeleteBusinessDialog, setShowDeleteBusinessDialog] = useState(false);
  const [deletingBusiness, setDeletingBusiness] = useState(false);
  const [professionalToDelete, setProfessionalToDelete] = useState<Professional | null>(null);
  const [showDeleteProfessionalDialog, setShowDeleteProfessionalDialog] = useState(false);
  const [deletingProfessional, setDeletingProfessional] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showProfessionalBulkDeleteDialog, setShowProfessionalBulkDeleteDialog] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [professionalBulkActionLoading, setProfessionalBulkActionLoading] = useState(false);

  // Loading per action
  const [addBusinessLoading, setAddBusinessLoading] = useState(false);
  const [editBusinessLoading, setEditBusinessLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [addProfessionalLoading, setAddProfessionalLoading] = useState(false);
  const [editProfessionalLoading, setEditProfessionalLoading] = useState(false);
  const [professionalToggleLoading, setProfessionalToggleLoading] = useState<string | null>(null);

  // Inquiry reject
  const [showRejectInquiryDialog, setShowRejectInquiryDialog] = useState(false);
  const [inquiryToReject, setInquiryToReject] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Registration dialogs
  const [selectedRegistrationInquiry, setSelectedRegistrationInquiry] = useState<any>(null);
  const [showRegistrationInquiryDialog, setShowRegistrationInquiryDialog] = useState(false);

  // Business listing dialog
  const [selectedBusinessListingInquiry, setSelectedBusinessListingInquiry] = useState<any>(null);
  const [showBusinessListingInquiryDialog, setShowBusinessListingInquiryDialog] = useState(false);

  // Close panel helper
  const closePanel = useCallback(() => {
    setShowRightPanel(false);
    setRightPanelContent(null);
    setGeneratedPassword("");
    setGeneratedUsername("");
    setEditingBusiness(null);
    setEditingProfessional(null);
    setEditingCategory(null);
    setCreatingAccount(null);
  }, []);

  // Generate credentials helper
  const handleGenerateCredentials = useCallback(
    (businessName: string, adminName: string) => {
      const base =
        adminName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
      setGeneratedUsername(`${base}_${Date.now().toString().slice(-4)}`);
      setGeneratedPassword(generatePassword());
    },
    []
  );

  // Generic mutation helper
  const mutate = useCallback(
    async (url: string, init: RequestInit, errorMessage: string) => {
      try {
        const res = await fetch(url, init);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast({ title: "Error", description: data.error || errorMessage, variant: "destructive" });
          return { ok: false, error: data.error || errorMessage, data: null };
        }
        const data = await res.json().catch(() => null);
        return { ok: true, error: null, data };
      } catch (err) {
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
        return { ok: false, error: errorMessage, data: null };
      }
    },
    [toast]
  );

  // Add business
  const handleAddBusiness = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setAddBusinessLoading(true);
      const fd = new FormData(e.currentTarget);
      const manualPassword = fd.get("password") as string;
      const payload = {
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        password: manualPassword || generatedPassword || generatePassword(),
        adminName: fd.get("adminName") as string,
        categoryId: fd.get("categoryId") as string,
        description: (fd.get("description") as string) || "",
        address: (fd.get("address") as string) || "",
        phone: (fd.get("phone") as string) || "",
        website: (fd.get("website") as string) || "",
      };
      const result = await mutate("/api/admin/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, "Failed to create business");

      if (result.ok) {
        setCredentials({ email: payload.email, password: payload.password, name: payload.name, type: "business" });
        setShowCredentialsModal(true);
        closePanel();
        (e.currentTarget as HTMLFormElement).reset();
      }
      setAddBusinessLoading(false);
      return result;
    },
    [mutate, generatedPassword, closePanel]
  );

  // Edit business
  const handleEditBusiness = useCallback((business: Business) => {
    setEditingBusiness(business);
    setRightPanelContent("edit-business");
    setShowRightPanel(true);
  }, []);

  const handleUpdateBusiness = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingBusiness) return;
      setEditBusinessLoading(true);
      const fd = new FormData(e.currentTarget);
      const payload = {
        name: fd.get("name") as string,
        description: (fd.get("description") as string) || "",
        logo: (fd.get("logo") as string) || "",
        address: (fd.get("address") as string) || "",
        phone: (fd.get("phone") as string) || "",
        email: fd.get("email") as string,
        categoryId: fd.get("categoryId") as string,
      };
      const result = await mutate(
        `/api/admin/businesses/${editingBusiness.id}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
        "Failed to update business"
      );
      if (result.ok) {
        setBusinesses((prev) => prev.map((b) => (b.id === editingBusiness.id ? { ...b, ...payload } : b)));
        closePanel();
        toast({ title: "Success", description: "Business updated successfully!" });
      }
      setEditBusinessLoading(false);
      return result;
    },
    [mutate, editingBusiness, closePanel, toast]
  );

  // Delete business
  const handleDeleteBusiness = useCallback((business: Business) => {
    setDeleteBusiness(business);
    setShowDeleteBusinessDialog(true);
  }, []);

  const confirmDeleteBusiness = useCallback(async () => {
    if (!deleteBusiness) return;
    setDeletingBusiness(true);
    setShowDeleteBusinessDialog(false);
    const result = await mutate(
      `/api/admin/businesses/${deleteBusiness.id}`,
      { method: "DELETE" },
      "Failed to delete business"
    );
    if (result.ok) {
      setBusinesses((prev) => prev.filter((b) => b.id !== deleteBusiness.id));
      setStats((prev) => ({
        ...prev,
        totalBusinesses: prev.totalBusinesses - 1,
        totalUsers: prev.totalUsers - 1,
        activeBusinesses: deleteBusiness.isActive ? prev.activeBusinesses - 1 : prev.activeBusinesses,
        totalProducts: prev.totalProducts - (deleteBusiness as any)._count?.products || 0,
        totalActiveProducts: deleteBusiness.isActive
          ? prev.totalActiveProducts - ((deleteBusiness as any)._count?.products || 0)
          : prev.totalActiveProducts,
      }));
      toast({ title: "Success", description: "Business deleted successfully" });
    }
    setDeletingBusiness(false);
    setDeleteBusiness(null);
  }, [mutate, deleteBusiness, toast]);

  // Toggle business status
  const handleToggleBusinessStatus = useCallback(
    async (e: React.MouseEvent, business: Business) => {
      e.preventDefault();
      setToggleLoading(business.id);
      const result = await mutate(
        `/api/admin/businesses/${business.id}`,
        { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !business.isActive }) },
        "Failed to update business status"
      );
      if (result.ok) {
        setBusinesses((prev) => prev.map((b) => (b.id === business.id ? { ...b, isActive: !b.isActive } : b)));
        setStats((prev) => ({
          ...prev,
          activeBusinesses: !business.isActive ? prev.activeBusinesses + 1 : prev.activeBusinesses - 1,
          totalActiveProducts: !business.isActive
            ? prev.totalActiveProducts + ((business as any)._count?.products || 0)
            : prev.totalActiveProducts - ((business as any)._count?.products || 0),
        }));
        toast({ title: "Success", description: `Business ${!business.isActive ? "activated" : "suspended"} successfully` });
      }
      setToggleLoading(null);
    },
    [mutate, toast]
  );

  // Duplicate business
  const handleDuplicateBusiness = useCallback(
    async (business: Business) => {
      if (!confirm(`Create a duplicate of "${business.name}"?`)) return;
      const result = await mutate(
        `/api/admin/businesses/${business.id}/duplicate`,
        { method: "POST" },
        "Failed to duplicate business"
      );
      if (result.ok && result.data) {
        setCredentials({
          email: result.data.loginCredentials?.email,
          password: result.data.loginCredentials?.password,
          name: result.data.name,
          type: "business",
        });
        setShowCredentialsModal(true);
      }
    },
    [mutate]
  );

  // Add professional
  const handleAddProfessional = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const manualPassword = fd.get("password") as string;
      const payload = {
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        password: manualPassword || generatedPassword || generatePassword(),
        adminName: fd.get("adminName") as string,
        phone: fd.get("phone") as string,
      };
      const result = await mutate("/api/admin/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, "Failed to create professional account");
      if (result.ok) {
        setCredentials({ email: payload.email, password: payload.password, name: payload.name, type: "professional" });
        setShowCredentialsModal(true);
        closePanel();
        (e.currentTarget as HTMLFormElement).reset();
      }
      setAddProfessionalLoading(false);
      return result;
    },
    [mutate, generatedPassword, closePanel]
  );

  // Edit professional
  const handleEditProfessional = useCallback((professional: Professional) => {
    setEditingProfessional(professional);
    setRightPanelContent("edit-professional");
    setShowRightPanel(true);
  }, []);

  const handleUpdateProfessional = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingProfessional) return;
      setEditProfessionalLoading(true);
      const fd = new FormData(e.currentTarget);
      const payload = {
        name: fd.get("name") as string,
        phone: fd.get("phone") as string,
        email: fd.get("email") as string,
      };
      const result = await mutate(
        `/api/admin/professionals/${editingProfessional.id}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
        "Failed to update professional"
      );
      if (result.ok) {
        setProfessionals((prev) => prev.map((p) => (p.id === editingProfessional.id ? { ...p, ...payload } : p)));
        closePanel();
        toast({ title: "Success", description: "Professional updated successfully!" });
      }
      setEditProfessionalLoading(false);
      return result;
    },
    [mutate, editingProfessional, closePanel, toast]
  );

  // Delete professional
  const handleDeleteProfessional = useCallback((professional: Professional) => {
    setProfessionalToDelete(professional);
    setShowDeleteProfessionalDialog(true);
  }, []);

  const confirmDeleteProfessional = useCallback(async () => {
    if (!professionalToDelete) return;
    setDeletingProfessional(true);
    setShowDeleteProfessionalDialog(false);
    const result = await mutate(
      `/api/admin/professionals/${professionalToDelete.id}`,
      { method: "DELETE" },
      "Failed to delete professional"
    );
    if (result.ok) {
      setProfessionals((prev) => prev.filter((p) => p.id !== professionalToDelete.id));
      setStats((prev) => ({
        ...prev,
        totalProfessionals: prev.totalProfessionals - 1,
        activeProfessionals: professionalToDelete.isActive ? prev.activeProfessionals - 1 : prev.activeProfessionals,
      }));
      toast({ title: "Success", description: "Professional deleted successfully" });
    }
    setDeletingProfessional(false);
    setProfessionalToDelete(null);
  }, [mutate, professionalToDelete, toast]);

  // Toggle professional status
  const handleToggleProfessionalStatus = useCallback(
    async (e: React.MouseEvent, professional: Professional) => {
      e.preventDefault();
      setProfessionalToggleLoading(professional.id);
      const result = await mutate(
        `/api/admin/professionals/${professional.id}`,
        { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !professional.isActive }) },
        "Failed to toggle professional status"
      );
      if (result.ok) {
        setProfessionals((prev) => prev.map((p) => (p.id === professional.id ? { ...p, isActive: !p.isActive } : p)));
        setStats((prev) => ({
          ...prev,
          activeProfessionals: !professional.isActive ? prev.activeProfessionals + 1 : prev.activeProfessionals - 1,
        }));
        toast({ title: "Success", description: `Professional ${!professional.isActive ? "activated" : "deactivated"} successfully` });
      }
      setProfessionalToggleLoading(null);
    },
    [mutate, toast]
  );

  // Category actions
  const handleAddCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const payload = {
        name: fd.get("name") as string,
        description: (fd.get("description") as string) || "",
        parentId: (fd.get("parentId") as string) || undefined,
      };
      const result = await mutate("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, "Failed to create category");
      if (result.ok) {
        setCategories((prev) => [...prev, result.data]);
        closePanel();
        toast({ title: "Success", description: "Category created successfully" });
      }
      return result;
    },
    [mutate, closePanel, toast]
  );

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setRightPanelContent("edit-category");
    setShowRightPanel(true);
  }, []);

  const handleUpdateCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingCategory) return;
      const fd = new FormData(e.currentTarget);
      const payload = {
        name: fd.get("name") as string,
        description: (fd.get("description") as string) || "",
        parentId: (fd.get("parentId") as string) || undefined,
      };
      const result = await mutate(
        `/api/admin/categories/${editingCategory.id}`,
        { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) },
        "Failed to update category"
      );
      if (result.ok) {
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? { ...c, ...payload } : c)));
        closePanel();
        toast({ title: "Success", description: "Category updated successfully" });
      }
      return result;
    },
    [mutate, editingCategory, closePanel, toast]
  );

  const handleDeleteCategory = useCallback(
    async (category: Category) => {
      if (!confirm(`Delete category "${category.name}"?`)) return;
      const result = await mutate(
        `/api/admin/categories/${category.id}`,
        { method: "DELETE" },
        "Failed to delete category"
      );
      if (result.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
        toast({ title: "Success", description: "Category deleted successfully" });
      }
    },
    [mutate, toast]
  );

  // Inquiry/registration actions
  const handleRejectInquiry = useCallback((inquiry: any) => {
    setInquiryToReject(inquiry);
    setShowRejectInquiryDialog(true);
  }, []);

  const confirmRejectInquiry = useCallback(async () => {
    if (!inquiryToReject) return;
    const result = await mutate(
      `/api/admin/registration-inquiries/${inquiryToReject.id}/reject`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: rejectReason }) },
      "Failed to reject inquiry"
    );
    if (result.ok) {
      setRegistrationInquiries((prev) =>
        prev.map((i) => (i.id === inquiryToReject.id ? { ...i, status: "REJECTED", adminNotes: rejectReason } : i))
      );
      toast({ title: "Success", description: "Inquiry rejected successfully" });
    }
    setShowRejectInquiryDialog(false);
    setInquiryToReject(null);
    setRejectReason("");
  }, [mutate, inquiryToReject, rejectReason, toast]);

  // Bulk actions
  const handleBusinessBulkDelete = useCallback(
    async (ids: string[]) => {
      setBulkActionLoading(true);
      const result = await mutate(
        "/api/admin/businesses/bulk/delete",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) },
        "Failed to delete businesses"
      );
      if (result.ok) {
        setBusinesses((prev) => prev.filter((b) => !ids.includes(b.id)));
        toast({ title: "Success", description: `${ids.length} businesses deleted successfully` });
      }
      setBulkActionLoading(false);
      setShowBulkDeleteDialog(false);
    },
    [mutate, toast]
  );

  const handleProfessionalBulkDelete = useCallback(
    async (ids: string[]) => {
      setProfessionalBulkActionLoading(true);
      const result = await mutate(
        "/api/admin/professionals/bulk/delete",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) },
        "Failed to delete professionals"
      );
      if (result.ok) {
        setProfessionals((prev) => prev.filter((p) => !ids.includes(p.id)));
        toast({ title: "Success", description: `${ids.length} professionals deleted successfully` });
      }
      setProfessionalBulkActionLoading(false);
      setShowProfessionalBulkDeleteDialog(false);
    },
    [mutate, toast]
  );

  return {
    // Router
    currentView,
    setCurrentView,
    settingsTab,
    setSettingsTab,
    settingsSection,
    setSettingsSection,

    // Data
    businesses,
    setBusinesses,
    professionals,
    setProfessionals,
    categories,
    setCategories,
    inquiries,
    setInquiries,
    businessListingInquiries,
    setBusinessListingInquiries,
    registrationInquiries,
    setRegistrationInquiries,
    stats,
    setStats,
    isLoading,
    setIsLoading,
    dataFetchError,
    setDataFetchError,

    // Search
    commandSearchTerm,
    setCommandSearchTerm,
    headerSearchResults,
    handleSearchResultSelect,

    // Right panel
    showRightPanel,
    setShowRightPanel,
    rightPanelContent,
    setRightPanelContent,
    editingBusiness,
    editingProfessional,
    editingCategory,
    creatingAccount,
    setCreatingAccount,
    closePanel,

    // Credentials
    generatedPassword,
    generatedUsername,
    showPassword,
    setShowPassword,
    showCredentialsModal,
    setShowCredentialsModal,
    credentials,
    setCredentials,
    handleGenerateCredentials,

    // Loading flags
    addBusinessLoading,
    editBusinessLoading,
    toggleLoading,
    addProfessionalLoading,
    editProfessionalLoading,
    professionalToggleLoading,
    bulkActionLoading,
    professionalBulkActionLoading,

    // Dialogs
    deleteBusiness,
    setDeleteBusiness,
    showDeleteBusinessDialog,
    setShowDeleteBusinessDialog,
    deletingBusiness,
    professionalToDelete,
    setProfessionalToDelete,
    showDeleteProfessionalDialog,
    setShowDeleteProfessionalDialog,
    deletingProfessional,
    categoryToDelete,
    setCategoryToDelete,
    showDeleteCategoryDialog,
    setShowDeleteCategoryDialog,
    showBulkDeleteDialog,
    setShowBulkDeleteDialog,
    showProfessionalBulkDeleteDialog,
    setShowProfessionalBulkDeleteDialog,

    // Inquiry dialogs
    showRejectInquiryDialog,
    setShowRejectInquiryDialog,
    inquiryToReject,
    setInquiryToReject,
    rejectReason,
    setRejectReason,
    selectedRegistrationInquiry,
    setSelectedRegistrationInquiry,
    showRegistrationInquiryDialog,
    setShowRegistrationInquiryDialog,
    selectedBusinessListingInquiry,
    setSelectedBusinessListingInquiry,
    showBusinessListingInquiryDialog,
    setShowBusinessListingInquiryDialog,

    // Handlers
    handleAddBusiness,
    handleEditBusiness,
    handleUpdateBusiness,
    handleDeleteBusiness,
    confirmDeleteBusiness,
    handleToggleBusinessStatus,
    handleDuplicateBusiness,
    handleAddProfessional,
    handleEditProfessional,
    handleUpdateProfessional,
    handleDeleteProfessional,
    confirmDeleteProfessional,
    handleToggleProfessionalStatus,
    handleAddCategory,
    handleEditCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleRejectInquiry,
    confirmRejectInquiry,
    handleBusinessBulkDelete,
    handleProfessionalBulkDelete,

    // Helpers
    mutate,
    generatePassword,
  };
}

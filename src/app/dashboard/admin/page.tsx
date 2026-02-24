"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSocket } from "@/lib/hooks/useSocket";
import { useQueryClient } from '@tanstack/react-query';
import { invalidateCategories } from '@/lib/cacheInvalidation';
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { UnifiedModal } from "@/components/ui/UnifiedModal";

import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Bell,
  Users,
  Building,
  MessageSquare,
  Key,
  BarChart3,
  FileText,
  Mail,
  Shield,
  Search,
  Download,
  Settings,
  Package,
  TrendingUp,
  Activity,
  X,
  UserCheck,
  AlertTriangle,
  Home,
  Grid3X3,
  FolderTree,
  MessageCircle,
  LineChart,
  Cog,
  MoreHorizontal,
  LogOut,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Zap,
  Image,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Globe,
  MapPin,
  Type,
  Hash,
  Lock,
  UserPlus,
  Filter,
  SlidersHorizontal,
  CheckCircle,
  Power,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Pagination, BulkActionsToolbar } from "@/components/ui/pagination";
import SharedSidebar from "../components/SharedSidebar";
import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { AdminTable } from "@/components/admin/AdminTable";

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  admin: {
    id: string;
    email: string;
    name?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  _count: {
    products: number;
    inquiries: number;
  };
}

// Pagination, Sorting, and Selection State for Businesses
interface BusinessQueryParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface BusinessApiResponse {
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface ProfessionalApiResponse {
  professionals: Professional[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  _count: {
    businesses: number;
  };
}

interface AdminStats {
  totalBusinesses: number;
  totalInquiries: number;
  totalUsers: number;
  activeBusinesses: number;
  totalProducts: number;
  totalActiveProducts: number;
  totalProfessionals: number;
  activeProfessionals: number;
}

interface Professional {
  id: string;
  name: string;
  slug: string;
  professionalHeadline: string | null;
  aboutMe: string | null;
  profilePicture: string | null;
  banner: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  adminId: string;
  workExperience?: any[];
  education?: any[];
  skills?: string[];
  servicesOffered?: any[];
  portfolio?: any[];
  admin: {
    id: string;
    email: string;
    name?: string;
  };
}

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
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [deleteBusiness, setDeleteBusiness] = useState<Business | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [showDeleteBusinessDialog, setShowDeleteBusinessDialog] = useState(false);
  const [deletingBusiness, setDeletingBusiness] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedBusinessListingInquiry, setSelectedBusinessListingInquiry] =
    useState<any>(null);
  const [
    showBusinessListingInquiryDialog,
    setShowBusinessListingInquiryDialog,
  ] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);
  const [dataFetchError, setDataFetchError] = useState<string | null>(null);
  const [creatingAccount, setCreatingAccount] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Business management state
  const [businessQuery, setBusinessQuery] = useState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [businessData, setBusinessData] = useState<BusinessApiResponse | null>(null);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [addBusinessLoading, setAddBusinessLoading] = useState(false);
  const [editBusinessLoading, setEditBusinessLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  
  // Debounce search term
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Professional form state

  // Professional form state
  const [professionalWorkExperience, setProfessionalWorkExperience] = useState<
    any[]
  >([]);
  const [professionalEducation, setProfessionalEducation] = useState<any[]>([]);
  const [professionalSkills, setProfessionalSkills] = useState<string[]>([]);
  const [professionalServices, setProfessionalServices] = useState<any[]>([]);
  const [professionalPortfolio, setProfessionalPortfolio] = useState<any[]>([]);
  const [professionalSocialMedia, setProfessionalSocialMedia] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });
  
  // Professional management state with pagination and selection
  const [professionalQuery, setProfessionalQuery] = useState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [professionalData, setProfessionalData] = useState<ProfessionalApiResponse | null>(null);
  const [professionalLoading, setProfessionalLoading] = useState(false);
  const [selectedProfessionalIds, setSelectedProfessionalIds] = useState<Set<string>>(new Set());
  const [professionalBulkActionLoading, setProfessionalBulkActionLoading] = useState(false);
  const [professionalExportLoading, setProfessionalExportLoading] = useState(false);
  const [addProfessionalLoading, setAddProfessionalLoading] = useState(false);
  const [editProfessionalLoading, setEditProfessionalLoading] = useState(false);
  const [professionalToggleLoading, setProfessionalToggleLoading] = useState<string | null>(null);
  const [showProfessionalBulkDeleteDialog, setShowProfessionalBulkDeleteDialog] = useState(false);
  const [deletingProfessional, setDeletingProfessional] = useState(false);
  const [professionalToDelete, setProfessionalToDelete] = useState<Professional | null>(null);
  const [showDeleteProfessionalDialog, setShowDeleteProfessionalDialog] = useState(false);
  const [professionalSortBy, setProfessionalSortBy] = useState('createdAt');
  const [professionalSortOrder, setProfessionalSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Inquiries management state
  const [inquiryToDelete, setInquiryToDelete] = useState<any>(null);
  const [showDeleteInquiryDialog, setShowDeleteInquiryDialog] = useState(false);
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
  const [inquiryQuery, setInquiryQuery] = useState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [inquiryPagination, setInquiryPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);

  // Registration management state
  const [selectedRegistrations, setSelectedRegistrations] = useState<Set<string>>(new Set());
  const [selectedRegistrationInquiry, setSelectedRegistrationInquiry] = useState<any>(null);
  const [showRegistrationInquiryDialog, setShowRegistrationInquiryDialog] = useState(false);
  const [registrationQuery, setRegistrationQuery] = useState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [registrationPagination, setRegistrationPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);

  // Business Listing management state
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [categoryQuery, setCategoryQuery] = useState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [categoryPagination, setCategoryPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);
  
  // Reject inquiry dialog state
  const [showRejectInquiryDialog, setShowRejectInquiryDialog] = useState(false);
  const [inquiryToReject, setInquiryToReject] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  
  const [businessListingQuery, setBusinessListingQuery] = useState<BusinessQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [businessListingPagination, setBusinessListingPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);
  const [selectedBusinessListings, setSelectedBusinessListings] = useState<Set<string>>(new Set());

  // Handle view inquiry
  const handleViewInquiry = (inquiry: any) => {
    console.log('View inquiry:', inquiry);
    // Could open a modal or navigate to detail view
    toast({
      title: 'Inquiry Details',
      description: `From: ${inquiry.name} (${inquiry.email})`,
    });
  };

  // Handle reply inquiry
  const handleReplyInquiry = (inquiry: any) => {
    console.log('Reply to inquiry:', inquiry);
    // Could open email composer
    toast({
      title: 'Reply to Inquiry',
      description: `Opening email client for ${inquiry.email}`,
    });
  };

  // Handle delete inquiry with dialog
  const handleDeleteInquiry = useCallback((inquiry: any) => {
    setInquiryToDelete(inquiry);
    setShowDeleteInquiryDialog(true);
  }, []);

  // Confirm delete inquiry
  const confirmDeleteInquiry = useCallback(() => {
    if (!inquiryToDelete) return;
    setInquiries(prev => prev.filter(i => i.id !== inquiryToDelete.id));
    setShowDeleteInquiryDialog(false);
    setInquiryToDelete(null);
    toast({
      title: 'Inquiry Deleted',
      description: 'The inquiry has been removed.',
    });
  }, [inquiryToDelete, toast]);

  // Inquiry bulk action handlers
  const handleSelectAllInquiries = () => {
    setSelectedInquiries(new Set(inquiries.map(i => i.id)));
  };

  const handleDeselectAllInquiries = () => {
    setSelectedInquiries(new Set());
  };

  const handleInquiryBulkActivate = async () => {
    if (selectedInquiries.size === 0) return;
    const ids = Array.from(selectedInquiries);
    try {
      await Promise.all(ids.map(async (id) => {
        await fetch(`/api/inquiries/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'REPLIED' }),
        });
      }));
      setInquiries(prev => prev.map(i => 
        selectedInquiries.has(i.id) ? { ...i, status: 'REPLIED' } : i
      ));
      toast({ title: 'Success', description: `${selectedInquiries.size} inquiries marked as REPLIED` });
      setSelectedInquiries(new Set());
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update inquiry status', variant: 'destructive' });
    }
  };

  const handleInquiryBulkSuspend = async () => {
    if (selectedInquiries.size === 0) return;
    const ids = Array.from(selectedInquiries);
    try {
      await Promise.all(ids.map(async (id) => {
        await fetch(`/api/inquiries/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'PENDING' }),
        });
      }));
      setInquiries(prev => prev.map(i => 
        selectedInquiries.has(i.id) ? { ...i, status: 'PENDING' } : i
      ));
      toast({ title: 'Success', description: `${selectedInquiries.size} inquiries marked as PENDING` });
      setSelectedInquiries(new Set());
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update inquiry status', variant: 'destructive' });
    }
  };

  const handleInquiryBulkDelete = () => {
    if (selectedInquiries.size === 0) return;
    setShowBulkDeleteDialog(true);
  };

  // Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

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
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleBusinessCreated = (data: any) => {
      console.log('Business created via Socket.IO:', data);
      setBusinesses(prev => [data.business, ...prev]);
      // Also update businessData if it exists
      setBusinessData(prev => prev ? {
        ...prev,
        businesses: [data.business, ...prev.businesses],
        pagination: {
          ...prev.pagination,
          totalItems: prev.pagination.totalItems + 1
        }
      } : null);
      setStats(prev => ({
        ...prev,
        totalBusinesses: prev.totalBusinesses + 1,
        totalUsers: prev.totalUsers + 1,
      }));
      toast({
        title: "Business Created",
        description: `${data.business.name} has been added to the platform.`,
      });
    };

    const handleBusinessUpdated = (data: any) => {
      console.log('Business updated via Socket.IO:', data);
      // Update both businesses state and businessData state
      setBusinesses(prev => prev.map(biz =>
        biz.id === data.business.id ? { ...biz, ...data.business } : biz
      ));
      setBusinessData(prev => prev ? {
        ...prev,
        businesses: prev.businesses.map(biz =>
          biz.id === data.business.id ? { ...biz, ...data.business } : biz
        )
      } : null);
      toast({
        title: "Business Updated",
        description: `${data.business.name} has been updated.`,
      });
    };

    const handleBusinessDeleted = (data: any) => {
      console.log('Business deleted via Socket.IO:', data);
      // Update both businesses state and businessData state
      setBusinesses(prev => prev.filter(biz => biz.id !== data.businessId));
      setBusinessData(prev => prev ? {
        ...prev,
        businesses: prev.businesses.filter(biz => biz.id !== data.businessId),
        pagination: {
          ...prev.pagination,
          totalItems: prev.pagination.totalItems - 1
        }
      } : null);
      setStats(prev => ({
        ...prev,
        totalBusinesses: prev.totalBusinesses - 1,
        totalUsers: prev.totalUsers - 1,
        activeBusinesses: prev.activeBusinesses - 1,
      }));
      toast({
        title: "Business Deleted",
        description: "A business has been removed from the platform.",
      });
    };

    const handleBusinessStatusUpdated = (data: any) => {
      console.log('Business status updated via Socket.IO:', data);
      // Update both businesses state and businessData state
      setBusinesses(prev => prev.map(biz =>
        biz.id === data.business.id ? { ...biz, ...data.business } : biz
      ));
      setBusinessData(prev => prev ? {
        ...prev,
        businesses: prev.businesses.map(biz =>
          biz.id === data.business.id ? { ...biz, ...data.business } : biz
        )
      } : null);
      setStats(prev => ({
        ...prev,
        activeBusinesses: data.business.isActive
          ? prev.activeBusinesses + 1
          : prev.activeBusinesses - 1,
      }));
      toast({
        title: "Business Status Updated",
        description: `${data.business.name} is now ${data.business.isActive ? 'active' : 'inactive'}.`,
      });
    };

    const handleProfessionalCreated = (data: any) => {
      console.log('Professional created via Socket.IO:', data);
      setProfessionals(prev => [data.professional, ...prev]);
      // Also update professionalData if it exists
      setProfessionalData(prev => prev ? {
        ...prev,
        professionals: [data.professional, ...prev.professionals],
        pagination: {
          ...prev.pagination,
          totalItems: prev.pagination.totalItems + 1
        }
      } : null);
      setStats(prev => ({
        ...prev,
        totalProfessionals: prev.totalProfessionals + 1,
      }));
      toast({
        title: "Professional Created",
        description: `${data.professional.name} has been added to the platform.`,
      });
    };

    const handleProfessionalUpdated = (data: any) => {
      console.log('Professional updated via Socket.IO:', data);
      setProfessionals(prev => prev.map(pro =>
        pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
      ));
      // Also update professionalData if it exists
      setProfessionalData(prev => prev ? {
        ...prev,
        professionals: prev.professionals.map(pro =>
          pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
        )
      } : null);
      toast({
        title: "Professional Updated",
        description: `${data.professional.name} has been updated.`,
      });
    };

    const handleProfessionalDeleted = (data: any) => {
      console.log('Professional deleted via Socket.IO:', data);
      setProfessionals(prev => prev.filter(pro => pro.id !== data.professionalId));
      // Also update professionalData if it exists
      setProfessionalData(prev => prev ? {
        ...prev,
        professionals: prev.professionals.filter(pro => pro.id !== data.professionalId),
        pagination: {
          ...prev.pagination,
          totalItems: prev.pagination.totalItems - 1
        }
      } : null);
      setStats(prev => ({
        ...prev,
        totalProfessionals: prev.totalProfessionals - 1,
        activeProfessionals: prev.activeProfessionals - 1,
      }));
      toast({
        title: "Professional Deleted",
        description: "A professional has been removed from the platform.",
      });
    };

    const handleProfessionalStatusUpdated = (data: any) => {
      console.log('Professional status updated via Socket.IO:', data);
      setProfessionals(prev => prev.map(pro =>
        pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
      ));
      setProfessionalData(prev => prev ? {
        ...prev,
        professionals: prev.professionals.map(pro =>
          pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
        )
      } : null);
      setStats(prev => ({
        ...prev,
        activeProfessionals: data.professional.isActive
          ? prev.activeProfessionals + 1
          : prev.activeProfessionals - 1,
      }));
      toast({
        title: "Professional Status Updated",
        description: `${data.professional.name} is now ${data.professional.isActive ? 'active' : 'inactive'}.`,
      });
    };

    const handleRegistrationInquiryUpdated = (data: any) => {
      console.log('Registration inquiry updated via Socket.IO:', data);
      setRegistrationInquiries(prev => prev.map(inquiry =>
        inquiry.id === data.inquiry.id ? { ...inquiry, ...data.inquiry } : inquiry
      ));
      toast({
        title: "Registration Inquiry Updated",
        description: `Request from ${data.inquiry.name} has been updated.`,
      });
    };

    const handleRegistrationInquiryStatusUpdated = (data: any) => {
      console.log('Registration inquiry status updated via Socket.IO:', data);
      setRegistrationInquiries(prev => prev.map(inquiry =>
        inquiry.id === data.inquiry.id ? { ...inquiry, ...data.inquiry } : inquiry
      ));
      setStats(prev => ({
        ...prev,
        totalInquiries: data.inquiry.status === 'PENDING' 
          ? prev.totalInquiries + 1 
          : Math.max(0, prev.totalInquiries - 1),
      }));
      toast({
        title: "Registration Request Status Updated",
        description: `${data.inquiry.name}'s request is now ${data.inquiry.status}.`,
      });
    };

    // Register event listeners
    socket.on('business-created', handleBusinessCreated);
    socket.on('business-updated', handleBusinessUpdated);
    socket.on('business-deleted', handleBusinessDeleted);
    socket.on('business-status-updated', handleBusinessStatusUpdated);
    socket.on('professional-created', handleProfessionalCreated);
    socket.on('professional-updated', handleProfessionalUpdated);
    socket.on('professional-deleted', handleProfessionalDeleted);
    socket.on('professional-status-updated', handleProfessionalStatusUpdated);
    socket.on('registration-inquiry-updated', handleRegistrationInquiryUpdated);
    socket.on('registration-inquiry-status-updated', handleRegistrationInquiryStatusUpdated);

    // Cleanup listeners on unmount
    return () => {
      socket.off('business-created', handleBusinessCreated);
      socket.off('business-updated', handleBusinessUpdated);
      socket.off('business-deleted', handleBusinessDeleted);
      socket.off('business-status-updated', handleBusinessStatusUpdated);
      socket.off('professional-created', handleProfessionalCreated);
      socket.off('professional-updated', handleProfessionalUpdated);
      socket.off('professional-deleted', handleProfessionalDeleted);
      socket.off('professional-status-updated', handleProfessionalStatusUpdated);
      socket.off('registration-inquiry-updated', handleRegistrationInquiryUpdated);
      socket.off('registration-inquiry-status-updated', handleRegistrationInquiryStatusUpdated);
    };
  }, [socket, isConnected, toast]);

  // Authentication check
  useEffect(() => {
    console.log('[DEBUG] Admin Dashboard - Auth Check:', {
      loading,
      user: user ? { id: user.id, role: user.role, email: user.email } : null,
      currentPath: window.location.pathname
    });
    if (!loading && (!user || user.role !== "SUPER_ADMIN")) {
      console.log('[DEBUG] Admin Dashboard - Redirecting to login:', {
        reason: !user ? 'No user' : `Wrong role: ${user.role}`,
        redirectingTo: '/login'
      });
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


  // Fetch businesses with pagination, search, and sorting
  const fetchBusinesses = useCallback(async () => {
    setBusinessLoading(true);
    try {
      const params = new URLSearchParams({
        page: businessQuery.page.toString(),
        limit: businessQuery.limit.toString(),
        search: businessQuery.search,
        status: businessQuery.status,
        sortBy: businessQuery.sortBy,
        sortOrder: businessQuery.sortOrder,
      });
      
      const response = await fetch(`/api/admin/businesses?${params}`);
      if (response.ok) {
        const data: BusinessApiResponse = await response.json();
        setBusinessData(data);
      }
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch businesses',
        variant: 'destructive',
      });
    } finally {
      setBusinessLoading(false);
    }
  }, [businessQuery, toast]);
  
  // Fetch businesses when query changes
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);
  
  // Update query when debounced search changes
  useEffect(() => {
    setBusinessQuery(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  // Handle sort change
  const handleSort = (column: string) => {
    setBusinessQuery(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1,
    }));
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setBusinessQuery(prev => ({ ...prev, page }));
  };
  
  // Handle items per page change
  const handleLimitChange = (limit: number) => {
    setBusinessQuery(prev => ({ ...prev, limit, page: 1 }));
  };
  
  // Handle selection
  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinessIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(businessId)) {
        newSet.delete(businessId);
      } else {
        newSet.add(businessId);
      }
      return newSet;
    });
  };
  
  const handleSelectAll = () => {
    if (businessData?.businesses) {
      const allIds = businessData.businesses.map(b => b.id);
      setSelectedBusinessIds(new Set(allIds));
    }
  };
  
  const handleDeselectAll = () => {
    setSelectedBusinessIds(new Set());
  };
  
  // Bulk actions
  const handleBulkActivate = async () => {
    if (selectedBusinessIds.size === 0) return;
    setBulkActionLoading(true);
    try {
      const response = await fetch('/api/admin/businesses/bulk/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedBusinessIds), isActive: true }),
      });
      if (response.ok) {
        toast({ title: 'Success', description: `${selectedBusinessIds.size} businesses activated` });
        setSelectedBusinessIds(new Set());
        fetchBusinesses();
        fetchData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to activate businesses', variant: 'destructive' });
    } finally {
      setBulkActionLoading(false);
    }
  };
  
  const handleBulkDeactivate = async () => {
    if (selectedBusinessIds.size === 0) return;
    setBulkActionLoading(true);
    try {
      const response = await fetch('/api/admin/businesses/bulk/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedBusinessIds), isActive: false }),
      });
      if (response.ok) {
        toast({ title: 'Success', description: `${selectedBusinessIds.size} businesses suspended` });
        setSelectedBusinessIds(new Set());
        fetchBusinesses();
        fetchData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to suspend businesses', variant: 'destructive' });
    } finally {
      setBulkActionLoading(false);
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedBusinessIds.size === 0) return;
    setShowBulkDeleteDialog(true);
  };
  
  const confirmBulkDelete = async () => {
    setBulkActionLoading(true);
    setShowBulkDeleteDialog(false);
    try {
      const response = await fetch('/api/admin/businesses/bulk/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedBusinessIds) }),
      });
      if (response.ok) {
        toast({ title: 'Success', description: `${selectedBusinessIds.size} businesses deleted` });
        setSelectedBusinessIds(new Set());
        fetchBusinesses();
        fetchData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete businesses', variant: 'destructive' });
    } finally {
      setBulkActionLoading(false);
    }
  };
  
  // Export to CSV
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const response = await fetch('/api/admin/businesses/export?format=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `businesses-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast({ title: 'Success', description: 'Businesses exported successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export businesses', variant: 'destructive' });
    } finally {
      setExportLoading(false);
    }
  };
  
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

  // Fetch professionals with pagination, search, and sorting
  const fetchProfessionals = useCallback(async () => {
    setProfessionalLoading(true);
    try {
      const params = new URLSearchParams({
        page: professionalQuery.page.toString(),
        limit: professionalQuery.limit.toString(),
        search: professionalQuery.search,
        status: professionalQuery.status,
        sortBy: professionalSortBy,
        sortOrder: professionalSortOrder,
      });
      
      const response = await fetch(`/api/admin/professionals?${params}`);
      if (response.ok) {
        const data: ProfessionalApiResponse = await response.json();
        setProfessionalData(data);
      }
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch professionals',
        variant: 'destructive',
      });
    } finally {
      setProfessionalLoading(false);
    }
  }, [professionalQuery, professionalSortBy, professionalSortOrder, toast]);
  
  // Fetch professionals when query changes
  useEffect(() => {
    if (currentView === 'professionals') {
      fetchProfessionals();
    }
  }, [fetchProfessionals, currentView]);
  
  // Update professional query when debounced search changes
  useEffect(() => {
    setProfessionalQuery(prev => ({ ...prev, search: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  // Handle professional sort change
  const handleProfessionalSort = (column: string) => {
    if (professionalSortBy === column) {
      setProfessionalSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setProfessionalSortBy(column);
      setProfessionalSortOrder('desc');
    }
    setProfessionalQuery(prev => ({ ...prev, page: 1 }));
  };
  
  // Handle professional page change
  const handleProfessionalPageChange = (page: number) => {
    setProfessionalQuery(prev => ({ ...prev, page }));
  };
  
  // Handle professional items per page change
  const handleProfessionalLimitChange = (limit: number) => {
    setProfessionalQuery(prev => ({ ...prev, limit, page: 1 }));
  };
  
  // Handle professional selection
  const handleSelectProfessional = (professionalId: string) => {
    setSelectedProfessionalIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(professionalId)) {
        newSet.delete(professionalId);
      } else {
        newSet.add(professionalId);
      }
      return newSet;
    });
  };
  
  const handleSelectAllProfessionals = () => {
    if (professionalData?.professionals) {
      const allIds = professionalData.professionals.map(p => p.id);
      setSelectedProfessionalIds(new Set(allIds));
    }
  };
  
  const handleDeselectAllProfessionals = () => {
    setSelectedProfessionalIds(new Set());
  };
  
  // Professional bulk actions
  const handleProfessionalBulkActivate = async () => {
    if (selectedProfessionalIds.size === 0) return;
    setProfessionalBulkActionLoading(true);
    try {
      const response = await fetch('/api/admin/professionals/bulk/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedProfessionalIds), isActive: true }),
      });
      if (response.ok) {
        toast({ title: 'Success', description: `${selectedProfessionalIds.size} professionals activated` });
        setSelectedProfessionalIds(new Set());
        fetchProfessionals();
        fetchData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to activate professionals', variant: 'destructive' });
    } finally {
      setProfessionalBulkActionLoading(false);
    }
  };
  
  const handleProfessionalBulkDeactivate = async () => {
    if (selectedProfessionalIds.size === 0) return;
    setProfessionalBulkActionLoading(true);
    try {
      const response = await fetch('/api/admin/professionals/bulk/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedProfessionalIds), isActive: false }),
      });
      if (response.ok) {
        toast({ title: 'Success', description: `${selectedProfessionalIds.size} professionals deactivated` });
        setSelectedProfessionalIds(new Set());
        fetchProfessionals();
        fetchData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to deactivate professionals', variant: 'destructive' });
    } finally {
      setProfessionalBulkActionLoading(false);
    }
  };
  
  const handleProfessionalBulkDelete = async () => {
    if (selectedProfessionalIds.size === 0) return;
    setShowProfessionalBulkDeleteDialog(true);
  };
  
  const confirmProfessionalBulkDelete = async () => {
    setProfessionalBulkActionLoading(true);
    setShowProfessionalBulkDeleteDialog(false);
    try {
      const response = await fetch('/api/admin/professionals/bulk/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedProfessionalIds) }),
      });
      if (response.ok) {
        toast({ title: 'Success', description: `${selectedProfessionalIds.size} professionals deleted` });
        setSelectedProfessionalIds(new Set());
        fetchProfessionals();
        fetchData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete professionals', variant: 'destructive' });
    } finally {
      setProfessionalBulkActionLoading(false);
    }
  };
  
  // Professional export to CSV
  const handleProfessionalExport = async () => {
    setProfessionalExportLoading(true);
    try {
      const response = await fetch('/api/admin/professionals/export?format=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `professionals-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast({ title: 'Success', description: 'Professionals exported successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export professionals', variant: 'destructive' });
    } finally {
      setProfessionalExportLoading(false);
    }
  };
  
  // Handle toggle professional status
  const handleToggleProfessionalStatus = useCallback(
    async (e: React.MouseEvent, professional: Professional) => {
      e.preventDefault();
      setProfessionalToggleLoading(professional.id);
      try {
        const response = await fetch(`/api/admin/professionals/${professional.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !professional.isActive }),
        });

        if (response.ok) {
          // Update the professional in the professionalData state immediately
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
          const error = await response.json();
          toast({ title: 'Error', description: `Failed to update status: ${error.error || 'Unknown error'}`, variant: 'destructive' });
        }
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to toggle status', variant: 'destructive' });
      } finally {
        setProfessionalToggleLoading(null);
      }
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
    
    try {
      const response = await fetch(`/api/admin/professionals/${professionalToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update the professional in the professionalData state immediately
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
        const error = await response.json();
        toast({ title: 'Error', description: `Failed to delete professional: ${error.error || 'Unknown error'}`, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete professional', variant: 'destructive' });
    } finally {
      setDeletingProfessional(false);
      setProfessionalToDelete(null);
    }
  }, [professionalToDelete, toast, fetchProfessionals]);

  // Data fetching function - Fixed to handle individual API failures gracefully
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setDataFetchError(null);

    try {
      console.log('[DEBUG] Admin Dashboard - Starting data fetch');
      
      // Fetch each API separately to avoid Promise.all failure
      const fetchPromises = [
        { name: 'businesses', url: "/api/admin/businesses" },
        { name: 'categories', url: "/api/admin/categories" },
        { name: 'inquiries', url: "/api/inquiries" },
        { name: 'professionals', url: "/api/admin/professionals" },
        { name: 'businessListingInquiries', url: "/api/business-listing-inquiries" },
        { name: 'registrationInquiries', url: "/api/registration-inquiries" },
      ];

      const results: Record<string, any> = {};
      
      // Fetch all data individually
      await Promise.all(
        fetchPromises.map(async (item) => {
          try {
            const response = await fetch(item.url);
            if (response.ok) {
              results[item.name] = await response.json();
            } else {
              console.error(`[DEBUG] ${item.name} API failed:`, response.status);
              results[item.name] = null;
            }
          } catch (error) {
            console.error(`[DEBUG] ${item.name} fetch error:`, error);
            results[item.name] = null;
          }
        })
      );

      console.log('[DEBUG] Admin Dashboard - API results:', {
        businesses: !!results.businesses,
        categories: !!results.categories,
        inquiries: !!results.inquiries,
        professionals: !!results.professionals,
        businessListingInquiries: !!results.businessListingInquiries,
        registrationInquiries: !!results.registrationInquiries,
      });

      // Extract data from API responses with proper error handling
      const businessesArray = Array.isArray(results.businesses?.businesses) ? results.businesses.businesses : [];
      const categoriesArray = Array.isArray(results.categories?.categories) ? results.categories.categories : [];
      const inquiriesArray = Array.isArray(results.inquiries?.inquiries) ? results.inquiries.inquiries : [];
      const professionalsArray = Array.isArray(results.professionals?.professionals) ? results.professionals.professionals : [];
      const businessListingInquiriesArray = Array.isArray(results.businessListingInquiries?.businessListingInquiries) 
        ? results.businessListingInquiries.businessListingInquiries 
        : [];
      
      // Fix: Handle registration inquiries response properly
      let registrationInquiriesArray: any[] = [];
      if (results.registrationInquiries) {
        if (Array.isArray(results.registrationInquiries.inquiries)) {
          registrationInquiriesArray = results.registrationInquiries.inquiries;
        } else if (Array.isArray(results.registrationInquiries)) {
          registrationInquiriesArray = results.registrationInquiries;
        } else if (results.registrationInquiries.inquiries) {
          registrationInquiriesArray = results.registrationInquiries.inquiries;
        }
      }

      console.log('Extracted arrays:', {
        businessesArray: businessesArray.length,
        categoriesArray: categoriesArray.length,
        inquiriesArray: inquiriesArray.length,
        professionalsArray: professionalsArray.length,
        businessListingInquiriesArray: businessListingInquiriesArray.length,
        registrationInquiriesArray: registrationInquiriesArray.length
      });

      setBusinesses(businessesArray);
      setCategories(categoriesArray);
      setInquiries(inquiriesArray);
      setProfessionals(professionalsArray);
      setBusinessListingInquiries(businessListingInquiriesArray);
      setRegistrationInquiries(registrationInquiriesArray);

      const totalProducts = businessesArray.reduce(
        (sum: number, b: Business) => sum + (b._count?.products || 0),
        0
      );
      const activeBusinesses = businessesArray.filter(
        (b: Business) => b.isActive
      ).length;
      const totalActiveProducts = businessesArray
        .filter((b: Business) => b.isActive)
        .reduce((sum: number, b: Business) => sum + (b._count?.products || 0), 0);
      const totalUsers = businessesArray.length;
      const activeProfessionals = professionalsArray.filter(
        (p: Professional) => p.isActive
      ).length;

      setStats({
        totalBusinesses: businessesArray.length,
        totalInquiries: registrationInquiriesArray.length,
        totalUsers,
        activeBusinesses,
        totalProducts,
        totalActiveProducts,
        totalProfessionals: professionalsArray.length,
        activeProfessionals,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setDataFetchError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debug logging for registration inquiries specifically
  useEffect(() => {
    if (currentView === "registration-requests") {
      console.log('Registration inquiries data:', {
        length: registrationInquiries.length,
        data: registrationInquiries,
        isLoading,
        dataFetchError
      });
    }
  }, [registrationInquiries, isLoading, dataFetchError, currentView]);

  // Generate password utility
  const generatePassword = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "Adm@";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }, []);

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      console.log("Creating business:", businessData);

      try {
        const response = await fetch("/api/admin/businesses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(businessData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Business creation successful");
          toast({
            title: "Success",
            description: `Business created successfully! Login credentials: Email: ${businessData.email}, Password: ${businessData.password}`,
          });
          setShowRightPanel(false);
          setRightPanelContent(null);
          setGeneratedPassword("");
          setGeneratedUsername("");
          // Reset form safely
          if (e.currentTarget) {
            e.currentTarget.reset();
          }
          // Refresh paginated data to show the new business
          fetchBusinesses();
          // Also refresh full data
          fetchData();
        } else {
          const error = await response.json();
          console.error("Business creation failed:", error);
          toast({
            title: "Error",
            description: `Failed to create business: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Business creation error:", error);
        toast({
          title: "Error",
          description: "Failed to create business. Please try again.",
          variant: "destructive",
        });
      } finally {
        setAddBusinessLoading(false);
      }
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

      console.log("Updating business:", editingBusiness.id, updateData);

      try {
        const response = await fetch(
          `/api/admin/businesses/${editingBusiness.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        if (response.ok) {
          console.log("Update successful, updating state...");
          
          // Update the business in the local state immediately
          setBusinesses((prev) =>
            prev.map((biz) =>
              biz.id === editingBusiness.id
                ? { ...biz, ...updateData }
                : biz
            )
          );

          // Force re-render to ensure UI updates
          setForceRerender((prev) => prev + 1);

          // Also refresh paginated data to ensure consistency
          fetchBusinesses();

          setShowRightPanel(false);
          setRightPanelContent(null);
          toast({
            title: "Success",
            description: "Business updated successfully!",
          });
        } else {
          const error = await response.json();
          console.error("Update failed:", error);
          toast({
            title: "Error",
            description: `Failed to update business: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Update error:", error);
        toast({
          title: "Error",
          description: "Failed to update business. Please try again.",
          variant: "destructive",
        });
      } finally {
        setEditBusinessLoading(false);
      }
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
    
    try {
      console.log("Deleting business:", deleteBusiness.id, deleteBusiness.name);
      const response = await fetch(`/api/admin/businesses/${deleteBusiness.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Business deletion successful, updating state...");

        // Remove the deleted business from the local state immediately
        setBusinesses((prev) => {
          const updatedBusinesses = prev.filter((biz) => biz.id !== deleteBusiness.id);
          console.log("Updated businesses list:", updatedBusinesses.length, "businesses remaining");
          return updatedBusinesses;
        });

        // Update stats immediately
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

        // Force re-render to ensure UI updates
        setForceRerender((prev) => prev + 1);

        // Also refresh paginated data
        fetchBusinesses();

        // Show success message with enhanced details
        toast({
          title: "Success",
          description: "Business and associated user deleted successfully",
        });
      } else {
        const error = await response.json();
        console.error("Business deletion failed:", error);
        toast({
          title: "Error",
          description: `Failed to delete business: ${
            error.error || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Business deletion error:", error);
      toast({
        title: "Error",
        description: "Failed to delete business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingBusiness(false);
      setDeleteBusiness(null);
    }
  }, [deleteBusiness, toast, fetchBusinesses]);

  // Handle toggle business status
  const handleToggleBusinessStatus = useCallback(
    async (e: React.MouseEvent, business: Business) => {
      e.preventDefault();
      setToggleLoading(business.id);
      console.log(
        "Toggling business status for:",
        business.id,
        "current isActive:",
        business.isActive
      );
      try {
        const response = await fetch(`/api/admin/businesses/${business.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isActive: !business.isActive }),
        });

        if (response.ok) {
          console.log("Toggle successful, updating state...");
          
          // Update the business in the local state immediately
          setBusinesses((prev) =>
            prev.map((biz) =>
              biz.id === business.id
                ? { ...biz, isActive: !biz.isActive }
                : biz
            )
          );

          // Update stats immediately
          setStats((prev) => ({
            ...prev,
            activeBusinesses: !business.isActive
              ? prev.activeBusinesses + 1
              : prev.activeBusinesses - 1,
            totalActiveProducts: !business.isActive
              ? prev.totalActiveProducts + business._count.products
              : prev.totalActiveProducts - business._count.products,
          }));

          // Force re-render to ensure UI updates
          setForceRerender((prev) => prev + 1);

          // Also refresh paginated data
          fetchBusinesses();

          toast({
            title: "Success",
            description: `Business ${!business.isActive ? 'activated' : 'suspended'} successfully`,
          });
        } else {
          const error = await response.json();
          console.error("Toggle failed:", error);
          toast({
            title: "Error",
            description: `Failed to update business status: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Toggle error:", error);
        toast({
          title: "Error",
          description: "Failed to toggle business status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setToggleLoading(null);
      }
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

      try {
        console.log("Duplicating business:", business.id, business.name);
        const response = await fetch(`/api/admin/businesses/${business.id}/duplicate`, {
          method: "POST",
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Business duplication successful:", result);
          
          // Refresh data to show the new business
          fetchBusinesses();
          fetchData();

          toast({
            title: "Success",
            description: `Business duplicated successfully! Login credentials for new admin:\nEmail: ${result.loginCredentials.email}\nPassword: ${result.loginCredentials.password}`,
            duration: 10000,
          });
        } else {
          const error = await response.json();
          console.error("Business duplication failed:", error);
          toast({
            title: "Error",
            description: `Failed to duplicate business: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Business duplication error:", error);
        toast({
          title: "Error",
          description: "Failed to duplicate business. Please try again.",
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

      console.log("Creating professional account:", professionalData);

      try {
        const response = await fetch("/api/admin/professionals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(professionalData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Professional account creation successful");
          toast({
            title: "Success",
            description: `Professional account created successfully! Login credentials: Email: ${professionalData.email}, Password: ${professionalData.password}`,
          });
          setShowRightPanel(false);
          setRightPanelContent(null);
          setGeneratedPassword("");
          setGeneratedUsername("");
          // Reset form safely
          if (e.currentTarget) {
            e.currentTarget.reset();
          }
          // Refresh data to show the new professional
          fetchData();
          fetchProfessionals();
          setProfessionalQuery(prev => ({ ...prev, page: 1 }));
        } else {
          const error = await response.json();
          console.error("Professional creation failed:", error);
          toast({
            title: "Error",
            description: `Failed to create professional account: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Professional creation error:", error);
        toast({
          title: "Error",
          description:
            "Failed to create professional account. Please try again.",
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

      console.log(
        "Updating professional account:",
        editingProfessional.id,
        updateData
      );

      try {
        const response = await fetch(
          `/api/admin/professionals/${editingProfessional.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        if (response.ok) {
          console.log("Account update successful, updating state...");
          
          // Update the professional in the professionalData state immediately
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

          // Refresh from API to ensure consistency
          fetchProfessionals();

          setShowRightPanel(false);
          setRightPanelContent(null);
          toast({
            title: "Success",
            description: "Professional account updated successfully!",
          });
        } else {
          const error = await response.json();
          console.error("Update failed:", error);
          toast({
            title: "Error",
            description: `Failed to update professional account: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Update error:", error);
        toast({
          title: "Error",
          description:
            "Failed to update professional account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [editingProfessional, toast, fetchProfessionals]
  );

  // Handle add category with improved error handling
  const handleAddCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const rawParentId = formData.get("parentId") as string;
      const categoryData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        parentId: rawParentId === "none" ? null : rawParentId || undefined,
      };

      try {
        const response = await fetch("/api/admin/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoryData),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Update local state immediately for better UX
          if (result.category) {
            setCategories(prev => [...prev, result.category]);
          }
          
          // Invalidate React Query cache to ensure all components get fresh data
          invalidateCategories(queryClient);
          
          // Refresh data from server to ensure consistency
          fetchData();
          
          toast({
            title: "Success",
            description: "Category created successfully!",
          });
          setShowRightPanel(false);
          setRightPanelContent(null);
          e.currentTarget.reset();
        } else {
          const error = await response.json();
          toast({
            title: "Error",
            description: `Failed to create category: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create category. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Handle edit category
  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setRightPanelContent("edit-category");
    setShowRightPanel(true);
  }, []);

  // Handle update category with improved error handling
  const handleUpdateCategory = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingCategory) return;

      const formData = new FormData(e.currentTarget);

      const rawParentId = formData.get("parentId") as string;
      const updateData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        parentId: rawParentId === "none" ? null : rawParentId || null,
      };

      console.log("Updating category:", editingCategory.id, updateData);

      try {
        const response = await fetch(
          `/api/admin/categories/${editingCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Category update successful");
          
          // Update local state immediately for better UX
          if (result.category && editingCategory) {
            setCategories(prev =>
              prev.map(c => c.id === editingCategory.id ? result.category : c)
            );
          }
          
          // Invalidate React Query cache to ensure all components get fresh data
          invalidateCategories(queryClient);
          
          // Refresh data from server to ensure consistency
          fetchData();
          
          setShowRightPanel(false);
          setRightPanelContent(null);
          toast({
            title: "Success",
            description: "Category updated successfully!",
          });
        } else {
          const error = await response.json();
          console.error("Category update failed:", error);
          toast({
            title: "Error",
            description: `Failed to update category: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Category update error:", error);
        toast({
          title: "Error",
          description: "Failed to update category. Please try again.",
          variant: "destructive",
        });
      }
    },
    [editingCategory, toast]
  );

  // Handle delete category with dialog
  const handleDeleteCategory = useCallback((category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteCategoryDialog(true);
  }, []);

  // Confirm delete category
  const confirmDeleteCategory = useCallback(async () => {
    if (!categoryToDelete) return;
    
    console.log("Deleting category:", categoryToDelete.id);

    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Category delete successful");
        // IMMEDIATE STATE REMOVAL - Remove deleted category from local state immediately
        setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
        setShowDeleteCategoryDialog(false);
        setCategoryToDelete(null);
        
        // Invalidate React Query cache to ensure all components get fresh data
        invalidateCategories(queryClient);
        
        fetchData();
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
      } else {
        const error = await response.json();
        console.error("Category delete failed:", error);
        toast({
          title: "Error",
          description: `Failed to delete category: ${
            error.error || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Category delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  }, [categoryToDelete, toast, fetchData]);

  // Handle update business listing inquiry with improved error handling
  const handleUpdateBusinessListingInquiry = useCallback(
    async (inquiryId: string, updates: any) => {
      try {
        const response = await fetch(
          `/api/business-listing-inquiries/${inquiryId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Update the inquiry in the list
          setBusinessListingInquiries((prev) =>
            prev.map((inquiry) =>
              inquiry.id === inquiryId ? data.inquiry : inquiry
            )
          );
          toast({
            title: "Success",
            description: "Inquiry updated successfully!",
          });
          setShowBusinessListingInquiryDialog(false);
          setSelectedBusinessListingInquiry(null);
        } else {
          const error = await response.json();
          toast({
            title: "Error",
            description: `Failed to update inquiry: ${
              error.error || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to update inquiry:", error);
        toast({
          title: "Error",
          description: "Failed to update inquiry. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Handle create account from inquiry with improved error handling
  const handleCreateAccountFromInquiry = useCallback(
    async (inquiry: any) => {
      if (
        !confirm(
          `Create ${inquiry.type.toLowerCase()} account for ${inquiry.name}? This will send login credentials to ${inquiry.email}.`
        )
      ) {
        return;
      }

      setCreatingAccount(inquiry.id);

      try {
        // First update inquiry status to UNDER_REVIEW
        const reviewResponse = await fetch(`/api/registration-inquiries/${inquiry.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "UNDER_REVIEW" }),
        });

        if (!reviewResponse.ok) {
          throw new Error("Failed to update inquiry status to under review");
        }

        // Update inquiry status in local state
        setRegistrationInquiries((prev) =>
          prev.map((regInquiry) =>
            regInquiry.id === inquiry.id
              ? { ...regInquiry, status: "UNDER_REVIEW" }
              : regInquiry
          )
        );

        // Generate password from stored hash (we'll decrypt or use a new one)
        // Since we stored the hashed password, we need to generate a new one for sending
        const generatedPassword = generatePassword();

        let response;
        let accountData;
        let successMessage;

        if (inquiry.type === "BUSINESS") {
          accountData = {
            name: inquiry.businessName || inquiry.name,
            email: inquiry.email,
            password: generatedPassword,
            adminName: inquiry.name,
            description: inquiry.businessDescription || "",
            phone: inquiry.phone || "",
            address: inquiry.location || inquiry.address || "",
            website: inquiry.website || "",
            categoryId: inquiry.categoryId || "",
          };
          response = await fetch("/api/admin/businesses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(accountData),
          });
          successMessage = "Business account created successfully!";
        } else {
          accountData = {
            name: inquiry.name,
            email: inquiry.email,
            password: generatedPassword,
            adminName: inquiry.name,
            phone: inquiry.phone || "",
            location: inquiry.location || "",
            aboutMe: inquiry.aboutMe || "",
            profession: inquiry.profession || "",
          };
          response = await fetch("/api/admin/professionals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(accountData),
          });
          successMessage = "Professional account created successfully!";
        }

        if (response.ok) {
          const result = await response.json();

          // Send email notification with credentials
          try {
            const emailResponse = await fetch("/api/notifications", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "accountCreation",
                name: inquiry.name,
                email: inquiry.email,
                password: generatedPassword,
                accountType: inquiry.type.toLowerCase(),
                loginUrl: `${window.location.origin}/login`,
              }),
            });

            if (!emailResponse.ok) {
              console.error("Failed to send account creation email");
            }
          } catch (emailError) {
            console.error("Email notification error:", emailError);
          }

          // Update inquiry status to COMPLETED
          const statusUpdateResponse = await fetch(`/api/registration-inquiries/${inquiry.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "COMPLETED" }),
          });

          if (statusUpdateResponse.ok) {
            // Update the inquiry in the list
            setRegistrationInquiries((prev) =>
              prev.map((regInquiry) =>
                regInquiry.id === inquiry.id
                  ? { ...regInquiry, status: "COMPLETED" }
                  : regInquiry
              )
            );

            toast({
              title: "Success",
              description: `${successMessage} Login credentials sent to ${inquiry.email}`,
            });

            // Refresh data to ensure the UI is up to date
            fetchData();
          } else {
            console.error("Failed to update inquiry status");
            toast({
              title: "Warning",
              description: `${successMessage} but failed to update inquiry status.`,
              variant: "destructive",
            });
          }
        } else {
          // Reset inquiry status back to PENDING if account creation failed
          await fetch(`/api/registration-inquiries/${inquiry.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "PENDING" }),
          });

          // Update local state back
          setRegistrationInquiries((prev) =>
            prev.map((regInquiry) =>
              regInquiry.id === inquiry.id
                ? { ...regInquiry, status: "PENDING" }
                : regInquiry
            )
          );

          const error = await response.json();
          console.error("Account creation failed:", error);
          toast({
            title: "Error",
            description: `Failed to create account: ${
              error.error || error.message || "Unknown error"
            }`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to create account:", error);
        toast({
          title: "Error",
          description: "Failed to create account. Please try again.",
          variant: "destructive",
        });
      } finally {
        setCreatingAccount(null);
      }
    },
    [generatePassword, toast, fetchData]
  );

  // Handle create account from inquiry with sidebar
  const handleCreateAccountFromInquiryWithSidebar = useCallback(
    (inquiry: any) => {
      // Set the inquiry data for the sidebar
      setEditingBusiness(inquiry.type === "BUSINESS" ? inquiry : null);
      setEditingProfessional(inquiry.type === "PROFESSIONAL" ? inquiry : null);

      // Open the account creation sidebar
      setRightPanelContent("create-account-from-inquiry");
      setShowRightPanel(true);
    },
    []
  );

  // Handle reject inquiry with improved error handling - now uses dialog
  const handleRejectInquiry = useCallback(
    (inquiry: any) => {
      setInquiryToReject(inquiry);
      setRejectReason("");
      setShowRejectInquiryDialog(true);
    },
    []
  );

  // Confirm reject inquiry with reason
  const confirmRejectInquiry = useCallback(async () => {
    if (!inquiryToReject) return;
    
    setCreatingAccount(inquiryToReject.id);
    setShowRejectInquiryDialog(false);

    try {
      const response = await fetch(
        `/api/registration-inquiries/${inquiryToReject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            status: "REJECTED",
            rejectReason: rejectReason || "No reason provided"
          }),
        }
      );

      if (response.ok) {
        // Update the inquiry in the list immediately
        setRegistrationInquiries((prev) =>
          prev.map((regInquiry) =>
            regInquiry.id === inquiryToReject.id
              ? { ...regInquiry, status: "REJECTED", rejectReason: rejectReason || "No reason provided" }
              : regInquiry
          )
        );

        toast({
          title: "Success",
          description: "Registration request rejected.",
        });

        // Refresh data from server to ensure consistency
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to reject inquiry: ${
            error.error || error.message || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to reject inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to reject inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingAccount(null);
      setInquiryToReject(null);
      setRejectReason("");
    }
  }, [inquiryToReject, rejectReason, toast, fetchData]);

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


  const renderSkeletonContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            {/* Stats Overview - Match actual 8-column grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6 mb-8">
              {/* 4 Stats cards - each spans 2 columns in 8-grid */}
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="bg-white border border-gray-200 shadow-sm rounded-3xl xl:col-span-2"
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
              {/* New Businesses Card - spans 4 columns */}
              <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-4 min-h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-32 bg-white/50" />
                  <Skeleton className="h-4 w-4 rounded bg-white/50" />
                </CardHeader>
                <CardContent className="flex-1 px-0 bg-white">
                  <div className="space-y-3 p-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32 flex-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* New Professionals Card - spans 4 columns */}
              <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-4 min-h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-32 bg-white/50" />
                  <Skeleton className="h-4 w-4 rounded bg-white/50" />
                </CardHeader>
                <CardContent className="flex-1 px-0 bg-white">
                  <div className="space-y-3 p-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32 flex-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Registration Requests Card - spans 6 columns */}
              <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-6 min-h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-48 bg-white/50" />
                  <Skeleton className="h-4 w-4 rounded bg-white/50" />
                </CardHeader>
                <CardContent className="flex-1 px-0 bg-white">
                  <div className="space-y-3 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32 flex-1" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Quick Actions Card - spans 2 columns */}
              <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl xl:col-span-2 min-h-[300px]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-28 bg-white/50" />
                  <Skeleton className="h-4 w-4 rounded bg-white/50" />
                </CardHeader>
                <CardContent className="flex-1 px-0">
                  <div className="space-y-3 p-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-full bg-white/30" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "businesses":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            {/* Toolbar */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-xl" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            {/* Data Table - Match actual table structure */}
            <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-12"><Skeleton className="h-4 w-4 bg-white/50" /></TableHead>
                      <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                      <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-lg" /></TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      case "professionals":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            {/* Toolbar */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-28 rounded-xl" />
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            {/* Data Table - Match actual professionals table structure */}
            <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-12"><Skeleton className="h-4 w-4 bg-white/50" /></TableHead>
                      <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                      <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Skeleton className="h-3 w-3" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      case "categories":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            {/* Toolbar */}
            <div className="space-y-3">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            {/* Data Table - Match AdminTable structure */}
            <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-32 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-28 bg-white/50" /></TableHead>
                      <TableHead className="text-center"><Skeleton className="h-4 w-20 bg-white/50 mx-auto" /></TableHead>
                      <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-32" />
                            {i === 1 && <Skeleton className="h-5 w-10 rounded-full" />}
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-6 w-10 rounded-full mx-auto" />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      case "inquiries":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <Skeleton className="h-7 w-56 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            {/* Toolbar */}
            <div className="space-y-3">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            {/* Data Table */}
            <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-32 bg-white/50" /></TableHead>
                      <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                      <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      case "registration-requests":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            {/* Search */}
            <Skeleton className="h-10 w-full rounded-xl" />
            {/* Data Table */}
            <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-28 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                      <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      case "business-listings":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            {/* Toolbar */}
            <div className="space-y-3">
              <Skeleton className="h-10 w-28 rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            {/* Data Table */}
            <div className="bg-white rounded-md  overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-12"><Skeleton className="h-4 w-4 bg-white/50" /></TableHead>
                      <TableHead className="w-14"><Skeleton className="h-4 w-8 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-32 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-24 bg-white/50" /></TableHead>
                      <TableHead className="text-center"><Skeleton className="h-4 w-16 bg-white/50 mx-auto" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-20 bg-white/50" /></TableHead>
                      <TableHead><Skeleton className="h-4 w-16 bg-white/50" /></TableHead>
                      <TableHead className="text-right w-32"><Skeleton className="h-4 w-16 bg-white/50 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-36" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <Skeleton className="h-8 w-8 rounded-md" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-8">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-40 w-full" />
                </Card>
              ))}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-8">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl p-6">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full rounded-2xl" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-10 w-32 rounded-2xl" />
              </div>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full" />
          </div>
        );
    }
  };


  const renderMiddleContent = () => {
    if (isLoading) {
      return renderSkeletonContent();
    }

    // Use forceRerender to ensure UI updates immediately
    const _ = forceRerender;

    // Ensure categories is always an array
    const safeCategories = Array.isArray(categories) ? categories : [];

    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-8">
              <h1 className="text-lg font-bold text-gray-900">
                Admin Dashboard Overview
              </h1>
              <p className="text-md text-gray-600">
                Welcome back! Here's what's happening with your business.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-8 gap-6">
              {/* --- ROW 1: 4 Cards (Each spans 2 columns in the 8-grid) --- */}

              <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    Active Businesses
                  </CardTitle>
                  <Building className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.activeBusinesses}
                  </div>
                  <p className="text-xs text-gray-500">Currently active</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    Active Professionals
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.activeProfessionals}
                  </div>
                  <p className="text-xs text-gray-500">Currently active</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    Registration Requests
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalInquiries}
                  </div>
                  <p className="text-xs text-gray-500">Pending requests</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg xl:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-900">
                    System Status
                  </CardTitle>
                  <Activity className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.activeBusinesses > 0 || stats.activeProfessionals > 0
                      ? "Excellent"
                      : "Growing"}
                  </div>
                  <p className="text-xs text-gray-500">Platform health</p>
                </CardContent>
              </Card>


              {/* Card 1: New Businesses */}
              <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-4 min-h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    New Businesses
                  </CardTitle>
                  <Building className="h-4 w-4 text-white" />
                </CardHeader>
                <CardContent className="flex-1 px-0 bg-white flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    {businesses.length > 0 ? (
                      <Table>
                        <TableHeader className="">
                          <TableRow>
                            <TableHead className="text-xs flex-1">
                              Name
                            </TableHead>
                            <TableHead className="text-xs w-auto">
                              Category
                            </TableHead>
                            <TableHead className="text-xs w-auto">
                              Status
                            </TableHead>
                            <TableHead className="text-xs w-auto">
                              Date
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {businesses
                            .sort(
                              (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime(),
                            )
                            .slice(0, 4)
                            .map((business) => (
                              <TableRow key={business.id}>
                                <TableCell className="text-xs font-medium flex-1">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {business.logo ? (
                                      <img
                                        src={business.logo}
                                        alt={`${business.name} logo`}
                                        className="h-8 w-8 rounded-full object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <Building className="h-4 w-4 text-gray-400" />
                                      </div>
                                    )}
                                    <span className="truncate">
                                      {business.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs w-auto">
                                  {business.category?.name || "N/A"}
                                </TableCell>
                                <TableCell className="w-auto">
                                  <div
                                    className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                                      business.isActive
                                        ? "bg-lime-500/10 border-lime-500/30 text-lime-700"
                                        : "bg-red-500/10 border-red-500/30 text-red-600"
                                    }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        business.isActive
                                          ? "bg-lime-500"
                                          : "bg-red-500"
                                      }`}
                                    ></span>
                                    {business.isActive ? "Active" : "Inactive"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs w-auto">
                                  {new Date(
                                    business.createdAt,
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                        <Building className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs font-medium">No Data</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: New Professionals (Updated Style) */}
              <Card className="flex flex-col bg-linear-90 overflow-hidden text-black bg-[#080322] px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-4 min-h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    New Professionals
                  </CardTitle>
                  <User className="h-4 w-4 text-white" />
                </CardHeader>
                <CardContent className="flex-1 px-0 bg-white flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    {professionals.length > 0 ? (
                      <Table>
                        <TableHeader className="">
                          <TableRow>
                            <TableHead className="text-xs flex-1">
                              Name
                            </TableHead>
                            <TableHead className="text-xs w-auto">
                              Profession
                            </TableHead>
                            <TableHead className="text-xs w-auto">
                              Status
                            </TableHead>
                            <TableHead className="text-xs w-auto">
                              Date
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {professionals
                            .sort(
                              (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime(),
                            )
                            .slice(0, 4)
                            .map((professional) => (
                              <TableRow key={professional.id}>
                                <TableCell className="text-xs font-medium flex-1">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {professional.profilePicture ? (
                                      <img
                                        src={professional.profilePicture}
                                        alt={`${professional.name} profile`}
                                        className="h-8 w-8 rounded-full object-cover shrink-0"
                                      />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <User className="h-4 w-4 text-gray-400" />
                                      </div>
                                    )}
                                    <span className="truncate">
                                      {professional.name}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs w-auto max-w-[150px] truncate">
                                  {professional.professionalHeadline || "N/A"}
                                </TableCell>
                                <TableCell className="w-auto">
                                  <div
                                    className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                                      professional.isActive
                                        ? "bg-lime-500/10 border-lime-500/30 text-lime-700"
                                        : "bg-red-500/10 border-red-500/30 text-red-600"
                                    }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        professional.isActive
                                          ? "bg-lime-500"
                                          : "bg-red-500"
                                      }`}
                                    ></span>
                                    {professional.isActive
                                      ? "Active"
                                      : "Inactive"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs w-auto">
                                  {new Date(
                                    professional.createdAt,
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                        <User className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs font-medium">No Data</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

          
              <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-6 min-h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Latest Registration Requests
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-white" />
                </CardHeader>
                <CardContent className="flex-1 px-0 bg-white flex flex-col">
                  <div className="overflow-x-auto flex-1">
                    {registrationInquiries.length > 0 ? (
                      <Table>
                        <TableHeader className="">
                          <TableRow>
                            <TableHead className="text-xs">Type</TableHead>
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">
                              Business/Profession
                            </TableHead>
                            <TableHead className="text-xs">Email</TableHead>
                            <TableHead className="text-xs">Status</TableHead>
                            <TableHead className="text-xs">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrationInquiries
                            .sort(
                              (a, b) =>
                                new Date(b.createdAt).getTime() -
                                new Date(a.createdAt).getTime(),
                            )
                            .slice(0, 5)
                            .map((inquiry) => (
                              <TableRow  key={inquiry.id}>
                                <TableCell >
                                  <div
                                    className={`flex  items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium w-fit  ${
                                      inquiry.type === "BUSINESS"
                                        ? "bg-blue-500/10 border-blue-500/30 text-blue-700"
                                        : "bg-purple-500/10 border-purple-500/30 text-purple-700"
                                    }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        inquiry.type === "BUSINESS"
                                          ? "bg-blue-500"
                                          : "bg-purple-500"
                                      }`}
                                    ></span>
                                    {inquiry.type === "BUSINESS" ? "B" : "P"}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs font-medium truncate">
                                  {inquiry.name}
                                </TableCell>
                                <TableCell className="text-xs truncate">
                                  {inquiry.businessName || "N/A"}
                                </TableCell>
                                <TableCell className="text-xs">
                                  {inquiry.email}
                                </TableCell>
                                <TableCell>
                                  <div className="flex justify-center">
                                    <StatusBadge
                                      status={inquiry.status}
                                      variant={inquiry.status === "PENDING" ? "warning" : inquiry.status === "COMPLETED" ? "success" : "error"}
                                    />
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs">
                                  {new Date(
                                    inquiry.createdAt,
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
                        <UserCheck className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-xs font-medium">
                          No Registration Requests
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Quick Actions with card-bg */}
              <Card className="flex flex-col  overflow-hidden text-black bg-[#080322]  px-0 pb-0 border-none shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg xl:col-span-2 min-h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Quick Actions
                  </CardTitle>
                  <Zap className="h-4 w-4 text-white" />
                </CardHeader>
                <CardContent className="flex-1 px-0  flex flex-col">
                  <div className="space-y-3 p-4">
                    <button
                      onClick={() => {
                        setRightPanelContent("add-business");
                        setShowRightPanel(true);
                      }}
                      className="w-full py-2.5 cursor-pointer px-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-lg"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Create Business
                    </button>
                    <button
                      onClick={() => {
                        setRightPanelContent("add-professional");
                        setShowRightPanel(true);
                      }}
                      className="w-full py-2.5 px-4  cursor-pointer rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-lg"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Create Professional
                    </button>
                    <button
                      onClick={() => {
                        setRightPanelContent("add-category");
                        setShowRightPanel(true);
                      }}
                      className="w-full py-2.5 px-4 cursor-pointer rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center justify-center shadow-lg"
                    >
                      <FolderTree className="h-4 w-4 mr-2" />
                      Create Category
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "businesses":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            {/* Data Fetching Status */}
            {dataFetchError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">
                      Data Fetching Error
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        fetchData();
                        fetchBusinesses();
                      }}
                      className="rounded-xl"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
                <p className="text-red-600 text-sm mt-1">{dataFetchError}</p>
              </div>
            )}

            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Manage Businesses
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Add, view, edit, and manage all registered businesses
              </p>
            </div>

            {/* Toolbar */}
            <div className="space-y-3">
              {/* Row 1: Action buttons (Filter, Export, Add) - With text on desktop */}
              <div className="flex gap-2">
                {/* Status Filter - With text on desktop */}
                <Select
                  value={businessQuery.status}
                  onValueChange={(value) => {
                    setBusinessQuery((prev) => ({
                      ...prev,
                      status: value,
                      page: 1,
                    }));
                  }}
                >
                  <SelectTrigger className=" rounded-xl bg-white border-gray-200">
                    <Filter className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                    <span className="sm:hidden">Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All ({businessData?.pagination.totalItems || filteredBusinesses.length})
                    </SelectItem>
                    <SelectItem value="active">
                      Active ({filteredBusinesses.filter((b) => b.isActive).length})
                    </SelectItem>
                    <SelectItem value="inactive">
                      Inactive ({filteredBusinesses.filter((b) => !b.isActive).length})
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Export Button - With text on desktop */}
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={exportLoading}
                  className="rounded-xl border-gray-200"
                >
                  {exportLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2" />
                  ) : (
                    <Download className="h-4 w-4 text-gray-500 mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {exportLoading ? 'Exporting...' : 'Export'}
                  </span>
                  <span className="sm:hidden">
                    {exportLoading ? '...' : ''}
                  </span>
                </Button>

                {/* Add New Button - With text on desktop */}
                <Button
                  onClick={() => {
                    setRightPanelContent("add-business");
                    setShowRightPanel(true);
                  }}
                  disabled={addBusinessLoading}
                  className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
                >
                  {addBusinessLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {addBusinessLoading ? 'Opening...' : 'Add Business'}
                  </span>
                  <span className="sm:hidden">
                    {addBusinessLoading ? '...' : 'Add'}
                  </span>
                </Button>
              </div>

              {/* Row 2: Search bar - Full width with inline filter */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search businesses..."
                  className="pl-10 pr-12 w-full rounded-xl rounded-r-none border-gray-200 bg-white focus-visible:ring-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none rounded-r-xl border-l-0 border-gray-200 bg-transparent hover:bg-gray-100 h-[42px] px-3"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedBusinessIds.size > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <BulkActionsToolbar
                  selectedCount={selectedBusinessIds.size}
                  totalCount={
                    businessData?.pagination.totalItems ||
                    filteredBusinesses.length
                  }
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                  onBulkActivate={handleBulkActivate}
                  onBulkDeactivate={handleBulkDeactivate}
                  onBulkDelete={handleBulkDelete}
                />
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-md   overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-12 text-white font-medium">
                        <Checkbox
                          checked={
                            businessData?.businesses.every((b) =>
                              selectedBusinessIds.has(b.id),
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) handleSelectAll();
                            else handleDeselectAll();
                          }}
                          className="border-gray-400"
                        />
                      </TableHead>
                      <TableHead className="w-14 text-white font-medium">
                        SN.
                      </TableHead>
                      <TableHead className="text-white font-medium">
                        Business
                      </TableHead>
                      <TableHead className="text-white font-medium">
                        Admin Email
                      </TableHead>
                      <TableHead className="text-white font-medium">
                        Category
                      </TableHead>
                      <TableHead className="text-center text-white font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-white font-medium">
                        Date
                      </TableHead>
                      <TableHead className="text-center text-white font-medium ">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {businessLoading
                      ? // Loading skeleton
                        Array.from({ length: businessQuery.limit }).map(
                          (_, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Skeleton className="h-4 w-4" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-8" />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Skeleton className="h-10 w-10 rounded-full" />
                                  <Skeleton className="h-4 w-32" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-40" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end space-x-2">
                                  <Skeleton className="h-8 w-8" />
                                  <Skeleton className="h-8 w-8" />
                                  <Skeleton className="h-8 w-8" />
                                </div>
                              </TableCell>
                            </TableRow>
                          ),
                        )
                      : businessData?.businesses.map((business, index) => (
                          <TableRow
                            key={business.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedBusinessIds.has(business.id)}
                                onCheckedChange={() =>
                                  handleSelectBusiness(business.id)
                                }
                                className="border-gray-400"
                              />
                            </TableCell>
                            <TableCell className="text-gray-500 font-medium">
                              {(businessData.pagination.page - 1) *
                                businessData.pagination.limit +
                                index +
                                1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {business.logo ? (
                                  <img
                                    src={business.logo}
                                    alt={`${business.name} logo`}
                                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <Building className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <span className="text-gray-900 font-medium truncate max-w-[200px]">
                                  {business.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 truncate">
                              {business.admin.email}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              <Badge
                                variant="outline"
                                className="rounded-lg bg-gray-50 border-gray-200 truncate max-w-[120px]"
                              >
                                {business.category?.name || "None"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div
                                className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
                                  business.isActive
                                        ? "bg-lime-500/10 border-lime-500/30 text-lime-700"
                                        : "bg-red-500/10 border-red-500/30 text-red-600"
                                }`}
                              >
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    business.isActive
                                      ? "bg-lime-500"
                                      : "bg-red-500"
                                  }`}
                                ></span>
                                {business.isActive ? "Active" : "Inactive"}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {new Date(business.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-8 w-8 p-0 rounded-lg ${
                                    business.isActive
                                      ? "hover:bg-orange-50"
                                      : "hover:bg-green-50"
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleToggleBusinessStatus(e, business);
                                  }}
                                  disabled={toggleLoading === business.id}
                                  title={business.isActive ? "Suspend Business" : "Activate Business"}
                                >
                                  {toggleLoading === business.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                                  ) : (
                                    <Power className={`h-4 w-4 ${
                                      business.isActive
                                        ? "text-orange-500"
                                        : "text-green-500"
                                    }`} />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                                  onClick={() =>
                                    window.open(
                                      `/catalog/${business.slug}`,
                                      "_blank",
                                    )
                                  }
                                  title="View Business"
                                >
                                  <Eye className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                                  onClick={() => handleEditBusiness(business)}
                                  title="Edit Business"
                                >
                                  <Edit className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                                  onClick={() => handleDeleteBusiness(business)}
                                  title="Delete Business"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {!businessLoading &&
                (!businessData?.businesses ||
                  businessData.businesses.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Building className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No businesses found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || businessQuery.status !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first business"}
                    </p>
                    {!searchTerm && businessQuery.status === "all" && (
                      <Button
                        onClick={() => {
                          setRightPanelContent("add-business");
                          setShowRightPanel(true);
                        }}
                        className="bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white rounded-xl hover:opacity-90 transition-opacity"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Business
                      </Button>
                    )}
                  </div>
                )}

              {/* Pagination */}
              {businessData && businessData.businesses.length > 0 && (
                <div className="p-2 border-t">
                  <Pagination
                    currentPage={businessData.pagination.page}
                    totalPages={businessData.pagination.totalPages}
                    totalItems={businessData.pagination.totalItems}
                    itemsPerPage={businessData.pagination.limit}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleLimitChange}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case "professionals":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            {/* Data Fetching Status */}
            {dataFetchError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">
                      Data Fetching Error
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        fetchData();
                        fetchProfessionals();
                      }}
                      className="rounded-xl"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
                <p className="text-red-600 text-sm mt-1">{dataFetchError}</p>
              </div>
            )}

            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Manage Professionals
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Add, view, edit, and manage all registered professionals
              </p>
            </div>

            {/* Toolbar */}
            <div className="space-y-3">
              {/* Row 1: Action buttons (Filter, Export, Add) - With text on desktop */}
              <div className="flex gap-2">
                {/* Status Filter - With text on desktop */}
                <Select
                  value={professionalQuery.status}
                  onValueChange={(value) => {
                    setProfessionalQuery((prev) => ({
                      ...prev,
                      status: value,
                      page: 1,
                    }));
                  }}
                >
                  <SelectTrigger className=" rounded-xl bg-white border-gray-200">
                    <Filter className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                    <span className="sm:hidden">Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All ({professionalData?.pagination.totalItems || professionals.length})
                    </SelectItem>
                    <SelectItem value="active">
                      Active ({professionals.filter((p) => p.isActive).length})
                    </SelectItem>
                    <SelectItem value="inactive">
                      Inactive ({professionals.filter((p) => !p.isActive).length})
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Export Button - With text on desktop */}
                <Button
                  variant="outline"
                  onClick={handleProfessionalExport}
                  disabled={professionalExportLoading}
                  className="rounded-xl border-gray-200"
                >
                  {professionalExportLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2" />
                  ) : (
                    <Download className="h-4 w-4 text-gray-500 mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {professionalExportLoading ? 'Exporting...' : 'Export'}
                  </span>
                  <span className="sm:hidden">
                    {professionalExportLoading ? '...' : ''}
                  </span>
                </Button>

                {/* Add New Button - With text on desktop */}
                <Button
                  onClick={() => {
                    setRightPanelContent("add-professional");
                    setShowRightPanel(true);
                  }}
                  disabled={addProfessionalLoading}
                  className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
                >
                  {addProfessionalLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">
                    {addProfessionalLoading ? 'Opening...' : 'Add Professional'}
                  </span>
                  <span className="sm:hidden">
                    {addProfessionalLoading ? '...' : 'Add'}
                  </span>
                </Button>
              </div>

              {/* Row 2: Search bar - Full width with inline filter */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search professionals..."
                  className="pl-10 pr-12 w-full rounded-xl rounded-r-none border-gray-200 bg-white focus-visible:ring-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none rounded-r-xl border-l-0 border-gray-200 bg-transparent hover:bg-gray-100 h-[42px] px-3"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedProfessionalIds.size > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <BulkActionsToolbar
                  selectedCount={selectedProfessionalIds.size}
                  totalCount={
                    professionalData?.pagination.totalItems ||
                    professionals.length
                  }
                  onSelectAll={handleSelectAllProfessionals}
                  onDeselectAll={handleDeselectAllProfessionals}
                  onBulkActivate={handleProfessionalBulkActivate}
                  onBulkDeactivate={handleProfessionalBulkDeactivate}
                  onBulkDelete={handleProfessionalBulkDelete}
                />
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-md   overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-12 text-white font-medium">
                        <Checkbox
                          checked={
                            professionalData?.professionals.every((p) =>
                              selectedProfessionalIds.has(p.id),
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) handleSelectAllProfessionals();
                            else handleDeselectAllProfessionals();
                          }}
                          className="border-gray-400"
                        />
                      </TableHead>
                      <TableHead className="w-14 text-white font-medium">
                        SN.
                      </TableHead>
                      <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort('name')}>
                        <div className="flex items-center gap-1">
                          Professional {getProfessionalSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort('email')}>
                        <div className="flex items-center gap-1">
                          Email {getProfessionalSortIcon('email')}
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort('professionalHeadline')}>
                        <div className="flex items-center gap-1">
                          Headline {getProfessionalSortIcon('professionalHeadline')}
                        </div>
                      </TableHead>
                      <TableHead className="text-white  truncate font-medium">
                        Location
                      </TableHead>
                      <TableHead className="text-center text-white font-medium">
                        Status
                      </TableHead>
                      <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort('createdAt')}>
                        <div className="flex items-center gap-1">
                          Date {getProfessionalSortIcon('createdAt')}
                        </div>
                      </TableHead>
                      <TableHead className="text-center text-white font-medium w-32">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {professionalLoading
                      ? // Loading skeleton
                        Array.from({ length: professionalQuery.limit }).map(
                          (_, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Skeleton className="h-4 w-4" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-8" />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Skeleton className="h-10 w-10 rounded-full" />
                                  <Skeleton className="h-4 w-32" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-40" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end space-x-2">
                                  <Skeleton className="h-8 w-8" />
                                  <Skeleton className="h-8 w-8" />
                                  <Skeleton className="h-8 w-8" />
                                </div>
                              </TableCell>
                            </TableRow>
                          ),
                        )
                      : professionalData?.professionals.map((professional, index) => (
                          <TableRow
                            key={professional.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedProfessionalIds.has(professional.id)}
                                onCheckedChange={() =>
                                  handleSelectProfessional(professional.id)
                                }
                                className="border-gray-400"
                              />
                            </TableCell>
                            <TableCell className="text-gray-500 font-medium">
                              {(professionalData.pagination.page - 1) *
                                professionalData.pagination.limit +
                                index +
                                1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {professional.profilePicture ? (
                                  <img
                                    src={professional.profilePicture}
                                    alt={`${professional.name} profile`}
                                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <User className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <span className="text-gray-900 font-medium truncate max-w-[200px]">
                                  {professional.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 truncate">
                              {professional.email || "N/A"}
                            </TableCell>
                            <TableCell className="text-gray-600 truncate max-w-[150px]">
                              {professional.professionalHeadline || "No headline"}
                            </TableCell>
                            <TableCell className="text-gray-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                {professional.location || "Not specified"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <StatusBadge
                                  status={professional.isActive ? "ACTIVE" : "SUSPENDED"}
                                  variant={professional.isActive ? "success" : "error"}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600">
                              {new Date(professional.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className={`h-8 w-8 p-0 rounded-lg ${
                                    professional.isActive
                                      ? "hover:bg-orange-50"
                                      : "hover:bg-green-50"
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleToggleProfessionalStatus(e, professional);
                                  }}
                                  disabled={professionalToggleLoading === professional.id}
                                  title={professional.isActive ? "Deactivate Professional" : "Activate Professional"}
                                >
                                  {professionalToggleLoading === professional.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                                  ) : (
                                    <Power className={`h-4 w-4 ${
                                      professional.isActive
                                        ? "text-orange-500"
                                        : "text-green-500"
                                    }`} />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                                  onClick={() =>
                                    window.open(
                                      `/pcard/${professional.slug}`,
                                      "_blank",
                                    )
                                  }
                                  title="View Profile"
                                >
                                  <Eye className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                                  onClick={() => handleEditProfessional(professional)}
                                  title="Edit Professional"
                                >
                                  <Edit className="h-4 w-4 text-gray-500" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                                  onClick={() => handleDeleteProfessional(professional)}
                                  title="Delete Professional"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {!professionalLoading &&
                (!professionalData?.professionals ||
                  professionalData.professionals.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No professionals found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {searchTerm || professionalQuery.status !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first professional"}
                    </p>
                    {!searchTerm && professionalQuery.status === "all" && (
                      <Button
                        onClick={() => {
                          setRightPanelContent("add-professional");
                          setShowRightPanel(true);
                        }}
                        className="bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white rounded-xl hover:opacity-90 transition-opacity"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Professional
                      </Button>
                    )}
                  </div>
                )}

              {/* Pagination */}
              {professionalData && professionalData.professionals.length > 0 && (
                <div className="p-2 border-t">
                  <Pagination
                    currentPage={professionalData.pagination.page}
                    totalPages={professionalData.pagination.totalPages}
                    totalItems={professionalData.pagination.totalItems}
                    itemsPerPage={professionalData.pagination.limit}
                    onPageChange={handleProfessionalPageChange}
                    onItemsPerPageChange={handleProfessionalLimitChange}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case "categories":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Manage Categories
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Add, view, edit, and manage all business categories
              </p>
            </div>

            {/* Toolbar */}
            <div className="space-y-3">
              {/* Row 1: Action buttons */}
              <div className="flex gap-2">
                {/* Add Category Button */}
                <Button
                  onClick={() => {
                    setRightPanelContent("add-category");
                    setShowRightPanel(true);
                  }}
                  className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Category</span>
                  <span className="sm:hidden">Add</span>
                </Button>

              </div>

              {/* Row 2: Search bar with inline filter */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search categories..."
                  className="pl-10 pr-12 w-full rounded-xl rounded-r-none border-gray-200 bg-white focus-visible:ring-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none rounded-r-xl border-l-0 border-gray-200 bg-transparent hover:bg-gray-100 h-[42px] px-3"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedCategories.size > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <BulkActionsToolbar
                  selectedCount={selectedCategories.size}
                  totalCount={safeCategories.length}
                  onSelectAll={() => {
                    const allIds = filteredCategories.map(c => c.id);
                    setSelectedCategories(new Set(allIds));
                  }}
                  onDeselectAll={() => setSelectedCategories(new Set())}
                  onBulkActivate={() => {
                    toast({ title: 'Info', description: 'Bulk activate not applicable for categories' });
                  }}
                  onBulkDeactivate={() => {
                    toast({ title: 'Info', description: 'Bulk deactivate not applicable for categories' });
                  }}
                  onBulkDelete={() => {
                    // Bulk delete handler would go here
                    toast({
                      title: 'Bulk Delete',
                      description: `Selected ${selectedCategories.size} categories`,
                    });
                  }}
                />
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-md  overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <Table>
                    <TableHeader className="bg-[#080322]">
                      <TableRow>
                        <TableHead className="w-14 text-white font-medium">SN.</TableHead>
                        <TableHead className="text-white font-medium">Category Name</TableHead>
                        <TableHead className="text-white font-medium">Slug</TableHead>
                        <TableHead className="text-white font-medium">Parent Category</TableHead>
                        <TableHead className="text-center text-white font-medium">Item Count</TableHead>
                        <TableHead className="text-center text-white font-medium ">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                              <FolderTree className="h-12 w-12 mb-3 opacity-30" />
                              <p className="text-base font-medium">No categories found</p>
                              <p className="text-sm text-gray-400 mt-1">
                                {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first category'}
                              </p>
                              {!searchTerm && (
                                <Button
                                  onClick={() => {
                                    setRightPanelContent("add-category");
                                    setShowRightPanel(true);
                                  }}
                                  className="mt-4 bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white rounded-xl hover:opacity-90 transition-opacity"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Category
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCategories.map((category, index) => {
                          const parentCategory = category.parentId 
                            ? safeCategories.find(c => c.id === category.parentId) 
                            : null;
                          
                          return (
                            <TableRow
                              key={category.id}
                              className={`hover:bg-gray-50 ${category.parentId ? 'bg-gray-50/50' : ''}`}
                            >
                              <TableCell className="text-gray-500 font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className={category.parentId ? 'text-sm' : 'font-medium'}>
                                    {category.name}
                                  </span>
                                  {category.parentId && (
                                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                                      Sub
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-gray-600 text-sm">
                                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                  {category.slug}
                                </code>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {parentCategory ? (
                                  <span className="text-sm">{parentCategory.name}</span>
                                ) : (
                                  <span className="text-gray-400 text-sm">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary" className="rounded-full">
                                  {category._count?.businesses || 0}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end space-x-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
                                    onClick={() => handleEditCategory(category)}
                                    title="Edit Category"
                                  >
                                    <Edit className="h-4 w-4 text-gray-500" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 rounded-md hover:bg-red-50"
                                    onClick={() => handleDeleteCategory(category)}
                                    title="Delete Category"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Table>
              </div>
            </div>
          </div>
        );
      case "inquiries":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
               Contact Inquiries Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage customer inquiries
              </p>
            </div>

            {/* Toolbar */}
            <div className="space-y-3">
              {/* Row 1: Action buttons */}
              <div className="flex gap-2">
                {/* Status Filter */}
                <Select
                  value={inquiryQuery?.status || "all"}
                  onValueChange={(value) => {
                    if (setInquiryQuery) {
                      setInquiryQuery((prev: any) => ({ ...prev, status: value, page: 1 }));
                    }
                  }}
                >
                  <SelectTrigger className="rounded-xl bg-white border-gray-200">
                    <Filter className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                    <span className="sm:hidden">Status</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({inquiries.length})</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REPLIED">Replied</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              {/* Row 2: Search bar with inline filter */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search inquiries..."
                  className="pl-10 pr-12 w-full rounded-xl rounded-r-none border-gray-200 bg-white focus-visible:ring-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none rounded-r-xl border-l-0 border-gray-200 bg-transparent hover:bg-gray-100 h-[42px] px-3"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedInquiries.size > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <BulkActionsToolbar
                  selectedCount={selectedInquiries.size}
                  totalCount={inquiries.length}
                  onSelectAll={handleSelectAllInquiries}
                  onDeselectAll={handleDeselectAllInquiries}
                  onBulkActivate={handleInquiryBulkActivate}
                  onBulkDeactivate={handleInquiryBulkSuspend}
                  onBulkDelete={handleInquiryBulkDelete}
                />
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white rounded-md  overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#080322]">
                    <TableRow>
                      <TableHead className="w-14 text-white font-medium">SN.</TableHead>
                      <TableHead className="text-white font-medium">Customer</TableHead>
                      <TableHead className="text-white font-medium">Business</TableHead>
                      <TableHead className="text-white font-medium">Message</TableHead>
                      <TableHead className="text-center text-white font-medium">Status</TableHead>
                      <TableHead className="text-white font-medium">Date</TableHead>
                      <TableHead className="text-center text-white font-medium ">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries
                      .filter((inquiry) => {
                        const matchesSearch =
                          inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
                        return matchesSearch;
                      })
                      .map((inquiry, index) => (
                        <TableRow key={inquiry.id} className="hover:bg-gray-50">
                          <TableCell className="text-gray-500 font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-400" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{inquiry.name}</div>
                                <div className="text-sm text-gray-500">{inquiry.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {inquiry.business?.name || "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-600 max-w-xs truncate">
                            {inquiry.message}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <StatusBadge
                                status={inquiry.status}
                                variant={inquiry.status === 'PENDING' ? 'warning' : inquiry.status === 'REPLIED' ? 'success' : 'neutral'}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                                onClick={() => handleViewInquiry(inquiry)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                                onClick={() => handleReplyInquiry(inquiry)}
                                title="Reply"
                              >
                                <Mail className="h-4 w-4 text-gray-500" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-lg hover:bg-red-50"
                                onClick={() => handleDeleteInquiry(inquiry)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Empty State */}
              {inquiries.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No inquiries found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm ? "Try adjusting your search" : "There are no customer inquiries yet"}
                  </p>
                </div>
              )}

              {/* Pagination */}
              {inquiries.length > 0 && (
                <div className="p-2 border-t">
                  <Pagination
                    currentPage={inquiryPagination?.page || 1}
                    totalPages={inquiryPagination?.totalPages || 1}
                    totalItems={inquiries.length}
                    itemsPerPage={inquiryPagination?.limit || 10}
                    onPageChange={(page) => {
                      if (setInquiryQuery) {
                        setInquiryQuery((prev: any) => ({ ...prev, page }));
                      }
                    }}
                    onItemsPerPageChange={(limit) => {
                      if (setInquiryQuery) {
                        setInquiryQuery((prev: any) => ({ ...prev, limit, page: 1 }));
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case "registration-requests":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Registration Requests
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Review and approve business and professional registration requests
              </p>
            </div>

            {/* Toolbar */}
            <div className="space-y-3">
            

              {/* Row 2: Search bar with inline filter */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search registration requests..."
                  className="pl-10 pr-12 w-full rounded-xl rounded-r-none border-gray-200 bg-white focus-visible:ring-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none rounded-r-xl border-l-0 border-gray-200 bg-transparent hover:bg-gray-100 h-[42px] px-3"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Data Fetching Status */}
            {dataFetchError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">
                      Data Fetching Error
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchData()}
                      className="rounded-xl"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
                <p className="text-red-600 text-sm mt-1">{dataFetchError}</p>
              </div>
            )}

            {/* Empty State */}
            {registrationInquiries.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <UserCheck className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Registration Requests
                </h3>
                <p className="text-gray-500">
                  There are currently no business or professional registration requests to review.
                </p>
              </div>
            )}

            {/* Data Table */}
            {registrationInquiries.length > 0 && (
              <AdminTable title="Registration Requests">
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-14 text-white font-medium">SN.</TableHead>
                    <TableHead className="text-white font-medium">Type</TableHead>
                    <TableHead className="text-white font-medium">Name</TableHead>
                    <TableHead className="text-white font-medium">Business Name</TableHead>
                    <TableHead className="text-white font-medium">Contact</TableHead>
                    <TableHead className="text-white    font-medium">Location</TableHead>
                    <TableHead className="text-center text-white font-medium">Status</TableHead>
                    <TableHead className="text-white font-medium">Date</TableHead>
                    <TableHead className="text-center text-white font-medium ">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationInquiries
                    .filter((inquiry) => {
                      const matchesSearch =
                        inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.location?.toLowerCase().includes(searchTerm.toLowerCase());
                      return matchesSearch;
                    })
                    .map((inquiry, index) => (
                      <TableRow key={inquiry.id} className="hover:bg-gray-50">
                        <TableCell className="text-gray-500 font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={inquiry.type === "BUSINESS" ? "default" : "secondary"}
                            className="rounded-full"
                          >
                            {inquiry.type === "BUSINESS" ? "B" : "P"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">
                          {inquiry.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {inquiry.businessName || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div>
                            <div className="text-sm">{inquiry.email}</div>
                            {inquiry.phone && (
                              <div className="text-sm text-gray-500">
                                {inquiry.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 w-auto max-w-[150px] truncate ">
                          {inquiry.location || "Not specified"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <StatusBadge
                              status={inquiry.status}
                              variant={inquiry.status === "PENDING" ? "warning" : inquiry.status === "COMPLETED" ? "success" : "error"}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            {inquiry.status === "PENDING" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-md hover:bg-green-50"
                                  onClick={() => handleCreateAccountFromInquiryWithSidebar(inquiry)}
                                  disabled={creatingAccount === inquiry.id}
                                  title="Create Account"
                                >
                                  {creatingAccount === inquiry.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                                  ) : (
                                    <UserCheck className="h-4 w-4 text-green-600" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 rounded-md hover:bg-red-50"
                                  onClick={() => handleRejectInquiry(inquiry)}
                                  disabled={creatingAccount === inquiry.id}
                                  title="Reject"
                                >
                                  {creatingAccount === inquiry.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
                              onClick={() => {
                                setSelectedRegistrationInquiry(inquiry);
                                setShowRegistrationInquiryDialog(true);
                              }}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </AdminTable>
            )}
          </div>
        );
      case "business-listings":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Business Listing Inquiries
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage business listing requests and digital presence enhancement inquiries
              </p>
            </div>

            {/* Toolbar */}
            <div className="space-y-3">
              {/* Row 1: Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fetchData()}
                  className="rounded-xl border-gray-200"
                >
                  <RefreshCw className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>

              {/* Row 2: Search bar with inline filter */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Search business listings..."
                  className="pl-10 pr-12 w-full rounded-xl rounded-r-none border-gray-200 bg-white focus-visible:ring-gray-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none rounded-r-xl border-l-0 border-gray-200 bg-transparent hover:bg-gray-100 h-[42px] px-3"
                >
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>

            {/* Bulk Actions Toolbar */}
            {selectedBusinessListings.size > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <BulkActionsToolbar
                  selectedCount={selectedBusinessListings.size}
                  totalCount={businessListingInquiries.length}
                  onSelectAll={() => setSelectedBusinessListings(new Set(businessListingInquiries.map(i => i.id)))}
                  onDeselectAll={() => setSelectedBusinessListings(new Set())}
                  onBulkActivate={() => {
                    toast({ title: 'Info', description: 'Bulk activate not implemented for listings' });
                  }}
                  onBulkDeactivate={() => {
                    toast({ title: 'Info', description: 'Bulk deactivate not implemented for listings' });
                  }}
                  onBulkDelete={() => {
                    toast({ title: 'Info', description: 'Bulk delete not implemented for listings' });
                  }}
                />
              </div>
            )}

            {/* Data Table */}
            {businessListingInquiries.length > 0 ? (
              <AdminTable title="Business Listings">
                <TableHeader className="bg-[#080322]">
                  <TableRow>
                    <TableHead className="w-12 text-white font-medium">
                      <Checkbox
                        checked={businessListingInquiries.length > 0 && selectedBusinessListings.size === businessListingInquiries.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBusinessListings(new Set(businessListingInquiries.map(i => i.id)));
                          } else {
                            setSelectedBusinessListings(new Set());
                          }
                        }}
                        className="border-gray-400"
                      />
                    </TableHead>
                    <TableHead className="w-14 text-white font-medium">SN.</TableHead>
                    <TableHead className="text-white font-medium">Business</TableHead>
                    <TableHead className="text-white font-medium">Contact</TableHead>
                    <TableHead className="text-white font-medium">Requirements</TableHead>
                    <TableHead className="text-white font-medium">Inquiry Type</TableHead>
                    <TableHead className="text-center text-white font-medium">Status</TableHead>
                    <TableHead className="text-white font-medium">Assigned To</TableHead>
                    <TableHead className="text-white font-medium">Date</TableHead>
                    <TableHead className="text-center text-white font-medium ">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {businessListingInquiries
                    .filter((inquiry) => {
                      const matchesSearch =
                        inquiry.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        inquiry.requirements?.toLowerCase().includes(searchTerm.toLowerCase());
                      return matchesSearch;
                    })
                    .map((inquiry, index) => (
                      <TableRow key={inquiry.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedBusinessListings.has(inquiry.id)}
                            onCheckedChange={() => {
                              setSelectedBusinessListings(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(inquiry.id)) {
                                  newSet.delete(inquiry.id);
                                } else {
                                  newSet.add(inquiry.id);
                                }
                                return newSet;
                              });
                            }}
                            className="border-gray-400"
                          />
                        </TableCell>
                        <TableCell className="text-gray-500 font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {inquiry.businessName}
                            </div>
                            {inquiry.businessDescription && (
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {inquiry.businessDescription}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">
                              {inquiry.contactName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {inquiry.email}
                            </div>
                            {inquiry.phone && (
                              <div className="text-sm text-gray-500">
                                {inquiry.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {inquiry.requirements}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {inquiry.inquiryType || "Not specified"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <StatusBadge
                              status={inquiry.status}
                              variant={
                                inquiry.status === "PENDING" ? "warning" :
                                inquiry.status === "REVIEWING" || inquiry.status === "UNDER_REVIEW" ? "info" :
                                inquiry.status === "APPROVED" ? "success" :
                                inquiry.status === "REJECTED" ? "error" : "neutral"
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {inquiry.assignedUser?.name || "Unassigned"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
                              onClick={() => {
                                setSelectedBusinessListingInquiry(inquiry);
                                setShowBusinessListingInquiryDialog(true);
                              }}
                              title="View Details"
                            >
                              <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 rounded-md hover:bg-gray-100"
                              onClick={() => {
                                setSelectedBusinessListingInquiry(inquiry);
                                setShowBusinessListingInquiryDialog(true);
                              }}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4 text-gray-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </AdminTable>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Business Listings Found
                </h3>
                <p className="text-gray-500">
                  There are currently no business listing inquiries to review.
                </p>
              </div>
            )}
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-8">
              <h1 className="text-lg font-bold text-gray-900">
                Platform Analytics
              </h1>
              <p className="text-md text-gray-600">
                Detailed analytics and insights
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6 pb-20 md:pb-0">
            <div className="mb-8">
              <h1 className="text-lg font-bold text-gray-900">
                System Settings
              </h1>
              <p className="text-md text-gray-600">
                Configure system preferences
              </p>
            </div>
            <div className="p-4 bg-white rounded-3xl sm:p-6">
              <div className="space-y-4">
                <div>
                  <Label>Platform Name</Label>
                  <Input defaultValue="DigiSense" className="rounded-2xl" />
                </div>
                <div>
                  <Label>Admin Email</Label>
                  <Input
                    defaultValue="admin@digisence.com"
                    className="rounded-2xl"
                  />
                </div>
                <Button className="rounded-2xl">Save Settings</Button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a menu item</div>;
    }
  };

    
const renderRightPanel = () => {
  if (!showRightPanel) return null;

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // --- ADD BUSINESS ---
  if (rightPanelContent === "add-business") {
    return (
      <form id="add-business-form" onSubmit={handleAddBusiness} onKeyDown={(e) => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') e.preventDefault(); }} className="space-y-4">
        <div className="space-y-2">
          <Label>Business Name</Label>
          <div className="relative">
            <Input name="name" required className="pl-10 rounded-md" placeholder="e.g. Acme Corp" />
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="relative">
            <Textarea name="description" className="pl-10 rounded-md" placeholder="Brief business description..." />
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="relative">
            <Select name="categoryId" required>
              <SelectTrigger className="pl-10 rounded-md">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone</Label>
            <div className="relative">
              <Input name="phone" className="pl-10 rounded-md" placeholder="+91 8080808080" />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <div className="relative">
              <Input name="website" className="pl-10 rounded-md" placeholder="https://example.com" />
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <Separator />
        <div>
          <h4 className="font-medium text-sm mb-4">Admin Account Details</h4>
          <div className="space-y-4 ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Admin Name</Label>
                <div className="relative">
                  <Input name="adminName" required className="pl-10 rounded-md" placeholder="Full Name" />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Admin Email</Label>
                <div className="relative">
                  <Input name="email" type="email" required className="pl-10 rounded-md" placeholder="admin@example.com" />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
           
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <div className="relative">
                  <Input name="username" value={generatedUsername} onChange={(e) => setGeneratedUsername(e.target.value)} className="pl-10 pr-20 rounded-md" placeholder="Auto-generated" />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 rounded-none hover:bg-transparent border-l"
                    onClick={(e) => {
                      e.preventDefault();
                      const form = document.getElementById("add-business-form") as HTMLFormElement;
                      const businessName = (form?.querySelector('input[name="name"]') as HTMLInputElement)?.value || "";
                      const adminName = (form?.querySelector('input[name="adminName"]') as HTMLInputElement)?.value || "";
                      const baseUsername = adminName.toLowerCase().replace(/[^a-z0-9]/g, "") || businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
                      setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
                    }}
                  >
                    <Key className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={generatedPassword}
                    onChange={(e) => setGeneratedPassword(e.target.value)}
                    className="pl-10 pr-20 rounded-md"
                    placeholder="Generated or manual password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <div className="absolute  right-1 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-transparent border-l rounded-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 hover:bg-transparent border-l rounded-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setGeneratedPassword(generatePassword());
                      }}
                    >
                      <Key className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  // --- EDIT BUSINESS ---
  if (rightPanelContent === "edit-business" && editingBusiness) {
    return (
      <form id="edit-business-form" onSubmit={handleUpdateBusiness} className="space-y-4">
        <div className="space-y-2">
          <Label>Business Name</Label>
          <div className="relative">
            <Input name="name" defaultValue={editingBusiness.name} required className="pl-10 rounded-md" placeholder="Business name" />
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="relative">
            <Textarea name="description" defaultValue={editingBusiness.description} className="pl-10 rounded-md" placeholder="Business description" />
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Logo URL</Label>
          <div className="relative">
            <Input name="logo" defaultValue={editingBusiness.logo} className="pl-10 rounded-md" placeholder="https://example.com/logo.png" />
            <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Address</Label>
            <div className="relative">
              <Input name="address" defaultValue={editingBusiness.address} className="pl-10 rounded-md" placeholder="Business address" />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <div className="relative">
              <Input name="phone" defaultValue={editingBusiness.phone} className="pl-10 rounded-md" placeholder="+91 8080808080" />
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <div className="relative">
              <Input name="website" defaultValue={editingBusiness.website} className="pl-10 rounded-md" placeholder="https://example.com" />
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Admin Email</Label>
            <div className="relative">
              <Input name="email" defaultValue={editingBusiness.admin.email} type="email" className="pl-10 rounded-md" placeholder="admin@example.com" />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <div className="relative">
            <Select name="categoryId" defaultValue={editingBusiness.category?.id || ""}>
              <SelectTrigger className="pl-10 rounded-md">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </form>
    );
  }

  // --- ADD PROFESSIONAL ---
  if (rightPanelContent === "add-professional") {
    return (
      <form id="add-professional-form" onSubmit={handleAddProfessional} className="space-y-4">
        <div className="space-y-2">
          <Label>Professional Name</Label>
          <div className="relative">
            <Input name="name" required className="pl-10 rounded-md" placeholder="Full Name" />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="relative">
            <Input name="phone" placeholder="+91 8080808080" className="pl-10 rounded-md" />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Separator />
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Login Credentials</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Admin Name</Label>
              <div className="relative">
                <Input name="adminName" required className="pl-10 rounded-md" placeholder="Admin name" />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Admin Email</Label>
              <div className="relative">
                <Input name="email" type="email" required className="pl-10 rounded-md" placeholder="admin@example.com" />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="relative">
                <Input name="username" value={generatedUsername} onChange={(e) => setGeneratedUsername(e.target.value)} className="pl-10 pr-20 rounded-md" placeholder="Auto-generated" />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 border-l rounded-none bg-none"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget.closest("form") as HTMLFormElement;
                    const professionalName = (form?.querySelector('input[name="name"]') as HTMLInputElement)?.value || "";
                    const adminName = (form?.querySelector('input[name="adminName"]') as HTMLInputElement)?.value || "";
                    const baseUsername = adminName.toLowerCase().replace(/[^a-z0-9]/g, "") || professionalName.toLowerCase().replace(/[^a-z0-9]/g, "");
                    setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
                  }}
                >
                  <Key className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={generatedPassword}
                  onChange={(e) => setGeneratedPassword(e.target.value)}
                  className="pl-10 pr-20 rounded-md"
                  placeholder="Generated or manual password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 hover:bg-transparent border-l rounded-none" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 hover:bg-transparent border-l rounded-none" onClick={(e) => { e.preventDefault(); setGeneratedPassword(generatePassword()); }}>
                    <Key className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  // --- EDIT PROFESSIONAL ---
  if (rightPanelContent === "edit-professional" && editingProfessional) {
    return (
      <form id="edit-professional-form" onSubmit={handleUpdateProfessional} className="space-y-4">
        <div className="space-y-2">
          <Label>Professional Name</Label>
          <div className="relative">
            <Input name="name" defaultValue={editingProfessional.name} required className="pl-10 rounded-md" placeholder="Full Name" />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="relative">
            <Input name="phone" defaultValue={editingProfessional.phone || ""} className="pl-10 rounded-md" placeholder="+91 8080808080" />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Input name="email" defaultValue={editingProfessional.email || ""} type="email" className="pl-10 rounded-md" placeholder="email@example.com" />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </form>
    );
  }

  // --- ADD CATEGORY ---
  if (rightPanelContent === "add-category") {
    return (
      <form id="add-category-form" onSubmit={handleAddCategory} className="space-y-4">
        <div className="space-y-2">
          <Label>Category Name</Label>
          <div className="relative">
            <Input name="name" required className="pl-10 rounded-md" placeholder="Category name" />
            <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="relative">
            <Textarea name="description" className="pl-10 rounded-md" placeholder="Category description..." />
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Parent Category</Label>
          <div className="relative">
            <Select name="parentId">
              <SelectTrigger className="pl-10 rounded-md">
                <SelectValue placeholder="Select parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent</SelectItem>
                {categories.filter((c) => !c.parentId).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </form>
    );
  }

  // --- EDIT CATEGORY ---
  if (rightPanelContent === "edit-category" && editingCategory) {
    return (
      <form id="edit-category-form" onSubmit={handleUpdateCategory} className="space-y-4">
        <div className="space-y-2">
          <Label>Category Name</Label>
          <div className="relative">
            <Input name="name" defaultValue={editingCategory.name} required className="pl-10 rounded-md" placeholder="Category name" />
            <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <div className="relative">
            <Textarea name="description" defaultValue={editingCategory.description} className="pl-10 rounded-md" placeholder="Category description..." />
            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Parent Category</Label>
          <div className="relative">
            <Select name="parentId" defaultValue={editingCategory.parentId || "none"}>
              <SelectTrigger className="pl-10 rounded-md">
                <SelectValue placeholder="Select parent category (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent</SelectItem>
                {safeCategories.filter((c) => !c.parentId && c.id !== editingCategory.id).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </form>
    );
  }

  // --- CREATE ACCOUNT FROM INQUIRY ---
  if (rightPanelContent === "create-account-from-inquiry" && (editingBusiness || editingProfessional)) {
    const inquiry = editingBusiness || editingProfessional;
    const isBusiness = !!editingBusiness;

    if (!inquiry) return null;

    return (
      <form id="inquiry-account-form" onSubmit={async (e) => { 
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const manualPassword = formData.get("password") as string;
          const password = manualPassword || generatedPassword || generatePassword();

          const accountData = {
            name: isBusiness ? (formData.get("businessName") as string) || (inquiry as any).businessName || inquiry.name : inquiry.name,
            email: inquiry.email,
            password: password,
            adminName: (formData.get("adminName") as string) || inquiry.name,
            phone: inquiry.phone,
            ...(isBusiness && {
              address: (inquiry as any).location,
              description: (formData.get("description") as string),
              categoryId: (formData.get("categoryId") as string),
            }),
          };

          try {
            const response = await fetch(isBusiness ? "/api/admin/businesses" : "/api/admin/professionals", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(accountData),
            });

            if (response.ok) {
              try {
                  await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                          type: "accountCreation", name: inquiry.name, email: inquiry.email,
                          password: password, accountType: isBusiness ? "business" : "professional",
                          loginUrl: `${window.location.origin}/login`,
                      }),
                  });
              } catch (err) { console.error(err); }

              await fetch(`/api/registration-inquiries/${inquiry.id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "COMPLETED" }),
              });

              setRegistrationInquiries((prev) => prev.map((regInquiry) => regInquiry.id === inquiry.id ? { ...regInquiry, status: "COMPLETED" } : regInquiry));
              toast({ title: "Success", description: `Account created! Email sent to ${inquiry.email}` });
              closePanel();
              fetchData();
            }
          } catch (error) {
              console.error(error);
              toast({ title: "Error", description: "Failed to create account.", variant: "destructive" });
          }
        }} className="space-y-4">
        
        <div className="bg-gray-50 p-4 rounded-md border">
          <h4 className="font-medium text-sm mb-2">Inquiry Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div>Type: <span className="font-medium text-gray-900">{isBusiness ? "Business" : "Professional"}</span></div>
            <div>Name: <span className="font-medium text-gray-900">{inquiry.name}</span></div>
            <div>Email: <span className="font-medium text-gray-900">{inquiry.email}</span></div>
            <div>Location: <span className="font-medium text-gray-900">{(inquiry as any).location || "N/A"}</span></div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-sm">Account Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Admin Name</Label>
              <div className="relative">
                <Input name="adminName" defaultValue={inquiry.name} required className="pl-10 rounded-md" placeholder="Admin name" />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            {isBusiness && (
              <>
                <div className="space-y-2 md:col-span-2">
                  <Label>Business Name</Label>
                  <div className="relative">
                    <Input name="businessName" defaultValue={(inquiry as any).businessName || inquiry.name} required className="pl-10 rounded-md" placeholder="Business name" />
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <div className="relative">
                    <Textarea name="description" placeholder="Brief description..." className="pl-10 rounded-md" />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Category</Label>
                  <div className="relative">
                    <Select name="categoryId">
                      <SelectTrigger className="pl-10 rounded-md">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                          {safeCategories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-sm">Login Credentials</h4>
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              const form = e.currentTarget.closest("form") as HTMLFormElement;
              const adminNameInput = form?.querySelector('input[name="adminName"]') as HTMLInputElement;
              const name = adminNameInput?.value || "";
              const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");
              setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
            }}
            className="w-full rounded-md"
          >
            <User className="h-4 w-4 mr-2" /> Generate Username
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="relative">
                <Input name="username" value={generatedUsername} onChange={(e) => setGeneratedUsername(e.target.value)} className="pl-10 pr-20 rounded-md" placeholder="Auto-generated" />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget.closest("form") as HTMLFormElement;
                    const adminNameInput = form?.querySelector('input[name="adminName"]') as HTMLInputElement;
                    const name = adminNameInput?.value || "";
                    const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");
                    setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
                  }}
                >
                  <Key className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={generatedPassword}
                  onChange={(e) => setGeneratedPassword(e.target.value)}
                  className="pl-10 pr-20 rounded-md"
                  placeholder="Generated or manual password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button type="button" variant="ghost" size="sm" className="h-8 px-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="h-8 px-2 rounded-md" onClick={(e) => { e.preventDefault(); setGeneratedPassword(generatePassword()); }}>
                    <Key className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return null;
};



  if (loading || isLoading) {
    return (
      <div className="min-h-screen relative flex flex-col">
        <div className="fixed inset-0     bg-center bg-slate-200  -z-10"></div>
        {/* Top Header Bar */}
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center px-4 sm:px-6 py-2">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl">
                <Skeleton className="h-8 w-8" />
              </div>
              <div>
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Skeleton className="h-8 w-24 rounded-2xl hidden sm:flex" />
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
            <div className="w-64 border bg-white border-r border-gray-200 flex flex-col shadow-sm overflow-auto hide-scrollbar">
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
            className={`flex-1 m-4 rounded-3xl bg-white/50 backdrop-blur-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ease-in-out pb-20 md:pb-0`}
          >
            <div className="flex-1   p-4 max-w-7xl mx-auto sm:p-6 overflow-auto hide-scrollbar">
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

  if (!user || user.role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="max-h-screen min-h-screen relative flex">
      <div className="fixed inset-0    bg-slate-200  -z-10"></div>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <SharedSidebar
          navLinks={menuItems}
          currentView={currentView}
          onViewChange={setCurrentView}
          onLogout={async () => {
            await logout();
            router.push("/login");
          }}
          onSettings={() => setCurrentView("settings")}
          onCollapsedChange={setSidebarCollapsed}
          isMobile={isMobile}
          headerTitle="Super Admin"
          headerIcon={Shield}
        />

        {/* Middle Content with Header */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header Bar - Now inside content area */}
          <div className="bg-white border-b border-gray-200 shadow-sm shrink-0 h-13 ">
            <div className="flex justify-between items-center px-4 sm:px-6 py-2">
              <div className="hidden md:flex"></div>
              <div className="flex items-center md:hidden">
                <img src="/logo.png" alt="DigiSense" className="h-8 w-auto" />
                <span className="h-8 border-l border-gray-300 mx-2"></span>
                <div>
                  <span className="font-semibold">Super Admin</span>
                </div>
              </div>
              <div className="flex items-center leading-tight space-x-2 sm:space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name || "Super Admin"}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <span className="h-8 border-l border-gray-300 mx-2"></span>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8  rounded-full  bg-black  flex items-center justify-center">
                    <Shield className="h-4 w-4 sm:h-4 sm:w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
            <div className="p-4 max-w-7xl mx-auto sm:p-6">{renderMiddleContent()}</div>
          </div>
        </div>

        {/* Right Editor Panel - UnifiedModal */}
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
      </div>


      {/* Business Listing Inquiry Dialog - Now uses UnifiedModal */}
      <UnifiedModal
        isOpen={showBusinessListingInquiryDialog}
        onClose={(open) => {
          if (!open) {
            setShowBusinessListingInquiryDialog(false);
            setSelectedBusinessListingInquiry(null);
          }
        }}
        title="Business Listing Inquiry Details"
        description="Review and manage this business listing inquiry"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowBusinessListingInquiryDialog(false);
                setSelectedBusinessListingInquiry(null);
              }}
              className="rounded-md w-auto px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedBusinessListingInquiry) {
                  const updates: any = {
                    status: selectedBusinessListingInquiry?.status,
                    notes: selectedBusinessListingInquiry?.notes,
                  };
                  if (selectedBusinessListingInquiry?.assignedTo) {
                    updates.assignedTo =
                      selectedBusinessListingInquiry.assignedTo;
                  }
                  handleUpdateBusinessListingInquiry(
                    selectedBusinessListingInquiry?.id,
                    updates,
                  );
                }
              }}
              className="rounded-md w-auto px-6 bg-black text-white hover:bg-gray-800"
            >
              Save Changes
            </Button>
          </>
        }
      >
        {selectedBusinessListingInquiry && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Business Name
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBusinessListingInquiry?.businessName ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Contact Name
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBusinessListingInquiry?.contactName ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Email
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBusinessListingInquiry?.email ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Phone
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBusinessListingInquiry.phone || "Not provided"}
                </p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-900">
                  Business Description
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBusinessListingInquiry?.businessDescription ||
                    "Not provided"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-900">
                  Inquiry Type
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedBusinessListingInquiry?.inquiryType ||
                    "Not specified"}
                </p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-gray-900">
                  Requirements
                </Label>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                  {selectedBusinessListingInquiry?.requirements ||
                    "Not provided"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Update Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="relative">
                    <Select
                      value={selectedBusinessListingInquiry.status}
                      onValueChange={(value) => {
                        const updated = {
                          ...selectedBusinessListingInquiry,
                          status: value,
                        };
                        setSelectedBusinessListingInquiry(updated);
                      }}
                    >
                      <SelectTrigger className="rounded-md pl-10">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="UNDER_REVIEW">
                          Under Review
                        </SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label>Assign To</Label>
                  <div className="relative">
                    <Select
                      value={
                        selectedBusinessListingInquiry.assignedTo || ""
                      }
                      onValueChange={(value) => {
                        const updated = {
                          ...selectedBusinessListingInquiry,
                          assignedTo: value || null,
                        };
                        setSelectedBusinessListingInquiry(updated);
                      }}
                    >
                      <SelectTrigger className="rounded-md pl-10">
                        <SelectValue placeholder="Select user or leave unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {/* You would fetch users here */}
                        <SelectItem value="admin1">Admin 1</SelectItem>
                        <SelectItem value="admin2">Admin 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={selectedBusinessListingInquiry?.notes || ""}
                  onChange={(e) => {
                    const updated = {
                      ...selectedBusinessListingInquiry,
                      notes: e.target.value,
                    };
                    setSelectedBusinessListingInquiry(updated);
                  }}
                  placeholder="Add internal notes..."
                  className="min-h-[100px] rounded-md pl-3"
                />
              </div>
            </div>
          </div>
        )}
      </UnifiedModal>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Confirm Bulk Delete
            </DialogTitle>
            <DialogDescription className="text-xs">
              Delete {selectedBusinessIds.size} businesses? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-700 font-medium">This will permanently delete:</p>
            <ul className="text-xs text-red-600 mt-1 list-disc list-inside space-y-0.5">
              <li>Selected business accounts</li>
              <li>Associated admin users & data</li>
            </ul>
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBulkDeleteDialog(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={confirmBulkDelete}
              disabled={bulkActionLoading}
              className="rounded-xl"
            >
              {bulkActionLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete ({selectedBusinessIds.size})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Business Confirmation Dialog */}
      <Dialog open={showDeleteBusinessDialog} onOpenChange={setShowDeleteBusinessDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Delete Business
            </DialogTitle>
            <DialogDescription className="text-xs">
              Delete "{deleteBusiness?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-700 font-medium">This will permanently delete:</p>
            <ul className="text-xs text-red-600 mt-1 list-disc list-inside space-y-0.5">
              <li>Business account & listing</li>
              <li>Associated admin user & data</li>
            </ul>
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowDeleteBusinessDialog(false);
                setDeleteBusiness(null);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={confirmDeleteBusiness}
              disabled={deletingBusiness}
              className="rounded-xl"
            >
              {deletingBusiness ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Professional Confirmation Dialog */}
      <Dialog open={showDeleteProfessionalDialog} onOpenChange={setShowDeleteProfessionalDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Delete Professional
            </DialogTitle>
            <DialogDescription className="text-xs">
              Delete "{professionalToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-700 font-medium">This will permanently delete:</p>
            <ul className="text-xs text-red-600 mt-1 list-disc list-inside space-y-0.5">
              <li>Professional profile & account</li>
              <li>Skills, education & portfolio</li>
            </ul>
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowDeleteProfessionalDialog(false);
                setProfessionalToDelete(null);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={confirmDeleteProfessional}
              disabled={deletingProfessional}
              className="rounded-xl"
            >
              {deletingProfessional ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <Dialog open={showDeleteCategoryDialog} onOpenChange={setShowDeleteCategoryDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Delete Category
            </DialogTitle>
            <DialogDescription className="text-xs">
              Delete "{categoryToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-700 font-medium">This will permanently delete:</p>
            <ul className="text-xs text-red-600 mt-1 list-disc list-inside space-y-0.5">
              <li>Category & subcategories</li>
              <li>Associated business references</li>
            </ul>
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowDeleteCategoryDialog(false);
                setCategoryToDelete(null);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={confirmDeleteCategory}
              className="rounded-xl"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Registration Request Dialog */}
      <Dialog open={showRejectInquiryDialog} onOpenChange={setShowRejectInquiryDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Reject Registration Request
            </DialogTitle>
            <DialogDescription className="text-xs">
              Reject request from "{inquiryToReject?.name}"? A notification will be sent.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="font-medium text-gray-900 ml-1">{inquiryToReject?.type}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900 ml-1 truncate">{inquiryToReject?.email}</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rejectReason" className="text-xs font-medium text-gray-900">
              Reason (optional)
            </Label>
            <Textarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              className="rounded-xl resize-none text-xs h-16"
            />
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowRejectInquiryDialog(false);
                setInquiryToReject(null);
                setRejectReason("");
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={confirmRejectInquiry}
              disabled={creatingAccount === inquiryToReject?.id}
              className="rounded-xl"
            >
              {creatingAccount === inquiryToReject?.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registration Inquiry Details Dialog */}
      <Dialog open={showRegistrationInquiryDialog} onOpenChange={setShowRegistrationInquiryDialog}>
        <DialogContent className="rounded-2xl max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              Registration Request Details
            </DialogTitle>
            <DialogDescription className="text-xs">
              Full details of the registration request
            </DialogDescription>
          </DialogHeader>
          {selectedRegistrationInquiry && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Type</span>
                    <p className="font-medium text-gray-900">
                      {selectedRegistrationInquiry.type === 'BUSINESS' ? 'Business' : 'Professional'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Status</span>
                    <p className="font-medium text-gray-900">
                      <StatusBadge
                        status={selectedRegistrationInquiry.status}
                        variant={selectedRegistrationInquiry.status === 'PENDING' ? 'warning' : selectedRegistrationInquiry.status === 'COMPLETED' ? 'success' : selectedRegistrationInquiry.status === 'REJECTED' ? 'error' : 'info'}
                      />
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Name</span>
                    <p className="font-medium text-gray-900">{selectedRegistrationInquiry.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Email</span>
                    <p className="font-medium text-gray-900">{selectedRegistrationInquiry.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Phone</span>
                    <p className="font-medium text-gray-900">{selectedRegistrationInquiry.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Location</span>
                    <p className="font-medium text-gray-900">{selectedRegistrationInquiry.location || 'Not provided'}</p>
                  </div>
                  {selectedRegistrationInquiry.type === 'BUSINESS' && (
                    <>
                      <div className="col-span-2">
                        <span className="text-gray-500 text-xs">Business Name</span>
                        <p className="font-medium text-gray-900">{selectedRegistrationInquiry.businessName || 'Not provided'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 text-xs">Business Description</span>
                        <p className="font-medium text-gray-900">{selectedRegistrationInquiry.businessDescription || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Website</span>
                        <p className="font-medium text-gray-900">{selectedRegistrationInquiry.website || 'Not provided'}</p>
                      </div>
                    </>
                  )}
                  {selectedRegistrationInquiry.type === 'PROFESSIONAL' && (
                    <>
                      <div>
                        <span className="text-gray-500 text-xs">Profession</span>
                        <p className="font-medium text-gray-900">{selectedRegistrationInquiry.profession || 'Not provided'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">About Me</span>
                        <p className="font-medium text-gray-900">{selectedRegistrationInquiry.aboutMe || 'Not provided'}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-gray-500 text-xs">Submitted On</span>
                    <p className="font-medium text-gray-900">
                      {selectedRegistrationInquiry.createdAt ? new Date(selectedRegistrationInquiry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Not provided'}
                    </p>
                  </div>
                  {selectedRegistrationInquiry.status === 'REJECTED' && selectedRegistrationInquiry.rejectReason && (
                    <div className="col-span-2">
                      <span className="text-gray-500 text-xs">Reject Reason</span>
                      <p className="font-medium text-red-600">{selectedRegistrationInquiry.rejectReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowRegistrationInquiryDialog(false);
                setSelectedRegistrationInquiry(null);
              }}
              className="rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/auth";
import { useTheme, ThemeProvider } from "@/contexts/ThemeContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Edit,
  Eye,
  EyeOff,
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
  Crown,
  Globe,
  UserCheck,
  AlertTriangle,
  Home,
  Grid3X3,
  FolderTree,
  LineChart,
  Cog,
  LogOut,
  User,
  Briefcase,
  MapPin,
  Phone,
  Globe as GlobeIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Image,
  Building2,
  GraduationCap,
  Upload,
  X,
  Award,
  ChevronRight,
  Palette,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { getOptimizedImageUrl, handleImageError, isValidImageUrl } from '@/lib/image-utils';
import SharedSidebar from '../../components/SharedSidebar';
import SharedDashboardHeader from "../../components/SharedDashboardHeader";


import ImageUpload from "@/components/ui/image-upload";
import BannerCropper from "@/components/ui/bannercropper";
import { ArrayFieldManager, ServiceForm, PortfolioItemForm } from "@/components/ui/array-field-manager";

type ButtonVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;


interface Professional {
  id: string;
  name: string;
  slug: string;
  professionName: string | null;
  professionalHeadline: string | null;
  aboutMe: string | null;
  profilePicture: string | null;
  banner: string | null;
  resume: string | null;
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
}

interface MenuItem {
  title: string;
  icon: any;
  mobileIcon: any;
  value: string;
  mobileTitle: string;
}

export default function ProfessionalDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { themeSettings, updateTheme, resetTheme, getBackgroundClass } =
    useTheme();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeProfileTab, setActiveProfileTab] = useState("basic");
  const [profileCompletion, setProfileCompletion] = useState(0);
  // Removed sidebarExpanded state as dropdown is removed

  const getHeaderTitle = () => {
    switch (activeProfileTab) {
      case "basic":
        return "Basic Information";
      case "experience":
        return "Work Experience";
      case "education":
        return "Education";
      case "services":
        return "Services";
      case "portfolio":
        return "Portfolio";
      case "contact":
        return "Contact Information";
      case "skills":
        return "Skills & Expertise";
      default:
        return "Basic Information";
    }
  };

  const getProfessionalSearchPlaceholder = () => {
    switch (currentView) {
      case "inquiries":
        return "Search client inquiries...";
      case "profile":
        return "Search profile details...";
      case "analytics":
        return "Search analytics insights...";
      case "theme":
        return "Search theme settings...";
      default:
        return "Search professional dashboard...";
    }
  };

  // Professional form state
  const [professionalWorkExperience, setProfessionalWorkExperience] = useState<
    any[]
  >([]);
  const [professionalEducation, setProfessionalEducation] = useState<any[]>([]);
  const [professionalServices, setProfessionalServices] = useState<any[]>([]);
  const [professionalPortfolio, setProfessionalPortfolio] = useState<any[]>([]);
  const [professionalSocialMedia, setProfessionalSocialMedia] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Inline editing states for profile fields
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [isEditingAboutMe, setIsEditingAboutMe] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingWebsite, setIsEditingWebsite] = useState(false);
  const [isEditingFacebook, setIsEditingFacebook] = useState(false);
  const [isEditingTwitter, setIsEditingTwitter] = useState(false);
  const [isEditingInstagram, setIsEditingInstagram] = useState(false);
  const [isEditingLinkedin, setIsEditingLinkedin] = useState(false);

  // Local state for editing values to prevent focus loss
  const [editingName, setEditingName] = useState("");
  const [editingHeadline, setEditingHeadline] = useState("");
  const [editingAboutMe, setEditingAboutMe] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingPhone, setEditingPhone] = useState("");

  const [editingLocation, setEditingLocation] = useState("");
  const [editingWebsite, setEditingWebsite] = useState("");
  const [editingFacebook, setEditingFacebook] = useState("");
  const [editingTwitter, setEditingTwitter] = useState("");
  const [editingInstagram, setEditingInstagram] = useState("");
  const [editingLinkedin, setEditingLinkedin] = useState("");

  // Services state
  const [services, setServices] = useState<any[]>([]);
  const [isEditingServices, setIsEditingServices] = useState(false);

  // Portfolio state
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);

  // Skills state - enhanced with proficiency levels
  const [skills, setSkills] = useState<
    Array<{
      name: string;
      level: "beginner" | "intermediate" | "expert" | "master";
    }>
    >([]);

  // Work Experience state
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [isEditingExperience, setIsEditingExperience] = useState(true);

  // Experience dialog states
  const [showExperienceDialog, setShowExperienceDialog] = useState(false);
  const [editingExperienceItem, setEditingExperienceItem] = useState<number | null>(null);
  const [experienceFormData, setExperienceFormData] = useState({ position: '', company: '', location: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isCurrent: false });

  // Education dialog states
  const [showEducationDialog, setShowEducationDialog] = useState(false);
  const [editingEducationItem, setEditingEducationItem] = useState<number | null>(null);
  const [educationFormData, setEducationFormData] = useState({ degree: '', institution: '', year: '', description: '' });

  // Services dialog states
  const [showServicesDialog, setShowServicesDialog] = useState(false);
  const [editingServicesItem, setEditingServicesItem] = useState<number | null>(null);
  const [servicesFormData, setServicesFormData] = useState({ name: '', description: '', price: '' });

  // Portfolio dialog states
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<number | null>(null);
  const [portfolioFormData, setPortfolioFormData] = useState({ title: '', description: '', url: '' });

  // Skills dialog states
  const [showSkillsDialog, setShowSkillsDialog] = useState(false);
  const [editingSkillsItem, setEditingSkillsItem] = useState<number | null>(null);
  const [skillsFormData, setSkillsFormData] = useState({ name: '', level: 'intermediate' as const });

  // Skills editing states
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("all");

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formatDuration = (item: any) => {
    if (item.startMonth && item.startYear) {
      const start = `${item.startMonth} ${item.startYear}`;
      const end = item.isCurrent ? 'Present' : (item.endMonth && item.endYear ? `${item.endMonth} ${item.endYear}` : '');
      return end ? `${start} - ${end}` : start;
    }
    return item.duration || '';
  };

  // Education state
  const [education, setEducation] = useState<any[]>([]);
  const [isEditingEducation, setIsEditingEducation] = useState(false);

  // Image upload modal states
  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  // Input refs for maintaining focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const headlineInputRef = useRef<HTMLInputElement>(null);
  const aboutMeInputRef = useRef<HTMLTextAreaElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);
  const facebookInputRef = useRef<HTMLInputElement>(null);
  const twitterInputRef = useRef<HTMLInputElement>(null);
  const instagramInputRef = useRef<HTMLInputElement>(null);
  const linkedinInputRef = useRef<HTMLInputElement>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showInquiryDialog, setShowInquiryDialog] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    profileViews: 0,
  });

  // Create professional state
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  useEffect(() => {
    // Check if mobile on initial load and on resize
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

  const calculateProfileCompletion = () => {
    if (!professional) return 0;

    let completion = 0;
    const totalFields = 10; // Total fields to complete

    // Check each field and increment completion
    if (professional.name) completion++;
    if (professional.professionalHeadline) completion++;
    if (professional.aboutMe) completion++;
    if (professional.profilePicture) completion++;
    if (professional.banner) completion++;
    if (professional.location) completion++;
    if (professional.phone) completion++;
    if (professional.email) completion++;
    if (professional.website) completion++;

    // Check social media links
    if (professional.facebook || professional.twitter || professional.instagram || professional.linkedin) {
      completion++;
    }

    // Calculate percentage
    const percentage = Math.round((completion / totalFields) * 100);
    return percentage;
  };

  const getProfileCompletionStatus = (percentage: number) => {
    if (percentage === 100) return "Complete";
    if (percentage >= 75) return "Almost Complete";
    if (percentage >= 50) return "Halfway There";
    if (percentage >= 25) return "Getting Started";
    return "Just Beginning";
  };

  useEffect(() => {
    console.log('[DEBUG] Professional Dashboard - Auth Check:', {
      loading,
      user: user ? { id: user.id, role: user.role, email: user.email } : null,
      currentPath: window.location.pathname
    });
    // Note: Authentication is now handled by the parent route wrapper
    // This component assumes the user is authenticated and authorized

    if (user?.role === ("PROFESSIONAL_ADMIN" as UserRole)) {
      fetchProfessionalData();
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (professional) {
      const completion = calculateProfileCompletion();
      setProfileCompletion(completion);
    }
  }, [professional]);

  // Focus inputs when entering edit mode
  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus();
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingHeadline) headlineInputRef.current?.focus();
  }, [isEditingHeadline]);

  useEffect(() => {
    if (isEditingAboutMe) aboutMeInputRef.current?.focus();
  }, [isEditingAboutMe]);

  useEffect(() => {
    if (isEditingEmail) emailInputRef.current?.focus();
  }, [isEditingEmail]);

  useEffect(() => {
    if (isEditingPhone) phoneInputRef.current?.focus();
  }, [isEditingPhone]);



  useEffect(() => {
    if (isEditingLocation) locationInputRef.current?.focus();
  }, [isEditingLocation]);

  useEffect(() => {
    if (isEditingWebsite) websiteInputRef.current?.focus();
  }, [isEditingWebsite]);

  useEffect(() => {
    if (isEditingFacebook) facebookInputRef.current?.focus();
  }, [isEditingFacebook]);

  useEffect(() => {
    if (isEditingTwitter) twitterInputRef.current?.focus();
  }, [isEditingTwitter]);

  useEffect(() => {
    if (isEditingInstagram) instagramInputRef.current?.focus();
  }, [isEditingInstagram]);

  useEffect(() => {
    if (isEditingLinkedin) linkedinInputRef.current?.focus();
  }, [isEditingLinkedin]);

  const fetchProfessionalData = async () => {
    try {
      setIsLoading(true);

      // Fetch basic professional profile
      const response = await fetch("/api/professionals", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        // Find the professional associated with this user
        const userProfessional = data.professionals.find(
          (p: Professional) => p.adminId === user?.id
        );
        if (userProfessional) {
          setProfessional(userProfessional);
          setProfessionalSocialMedia({
            facebook: userProfessional.facebook || "",
            twitter: userProfessional.twitter || "",
            instagram: userProfessional.instagram || "",
            linkedin: userProfessional.linkedin || "",
          });
          setProfilePictureUrl(userProfessional.profilePicture || "");
          setBannerUrl(userProfessional.banner || "");
        }
      }

      // Fetch individual data sections
      const fetchPromises = [
        fetch("/api/professionals/experience", { cache: "no-store" }).then(
          (r) => (r.ok ? r.json() : { workExperience: [] })
        ),
        fetch("/api/professionals/education", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : { education: [] }
        ),
        fetch("/api/professionals/skills", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : { skills: [] }
        ),
        fetch("/api/professionals/services", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : { services: [] }
        ),
        fetch("/api/professionals/portfolio", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : { portfolio: [] }
        ),
      ];

      const [
        experienceData,
        educationData,
        skillsData,
        servicesData,
        portfolioData,
      ] = await Promise.all(fetchPromises);

      // Load structured data into form state
      setProfessionalWorkExperience(experienceData.workExperience || []);
      setProfessionalEducation(educationData.education || []);
      // Handle skills with proficiency levels
      const processedSkills = (skillsData.skills || []).map((skill: any) => {
        if (typeof skill === "string") {
          return { name: skill, level: "intermediate" as const };
        }
        return skill;
      });
      setSkills(processedSkills);
      setWorkExperience(experienceData.workExperience || []);
      setEducation(educationData.education || []);
      setProfessionalServices(servicesData.services || []);
      setProfessionalPortfolio(portfolioData.portfolio || []);

      // Load services and portfolio
      setServices(servicesData.services || []);
      setPortfolio(portfolioData.portfolio || []);

      // Fetch inquiries
      try {
        const inquiriesResponse = await fetch("/api/professionals/inquiries", {
          cache: "no-store",
        });
        if (inquiriesResponse.ok) {
          const inquiriesData = await inquiriesResponse.json();
          setInquiries(inquiriesData.inquiries);

          // Calculate stats
          const totalInquiries = inquiriesData.inquiries.length;
          const newInquiries = inquiriesData.inquiries.filter(
            (i: any) => i.status === "NEW"
          ).length;

          setStats((prev) => ({
            ...prev,
            totalInquiries,
            newInquiries,
          }));
        }
      } catch (inquiriesError) {
        console.error("Failed to fetch inquiries:", inquiriesError);
      }
    } catch (error) {
      console.error("Failed to fetch professional data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfessional = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const createData = {
      name: formData.get("name") as string,
      professionalHeadline: formData.get("professionalHeadline") as string,
      aboutMe: formData.get("aboutMe") as string,
      profilePicture: profilePictureUrl,
      banner: bannerUrl,
      location: formData.get("location") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      email: formData.get("email") as string,
      facebook: professionalSocialMedia.facebook,
      twitter: professionalSocialMedia.twitter,
      instagram: professionalSocialMedia.instagram,
      linkedin: professionalSocialMedia.linkedin,
      servicesOffered: professionalServices,
      portfolio: professionalPortfolio,
      adminId: user.id,
    };

    try {
      const response = await fetch("/api/professionals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfessional(data.professional);

        // Load structured data into form state
        setProfessionalWorkExperience(data.professional.workExperience || []);
        setProfessionalEducation(data.professional.education || []);
        // Handle skills with proficiency levels
        const processedSkills = (data.professional.skills || []).map(
          (skill: any) => {
            if (typeof skill === "string") {
              return { name: skill, level: "intermediate" as const };
            }
            return skill;
          }
        );
        setSkills(processedSkills);
        setWorkExperience(data.professional.workExperience || []);
        setEducation(data.professional.education || []);
        setProfessionalServices(data.professional.servicesOffered || []);
        setProfessionalPortfolio(data.professional.portfolio || []);
        setProfessionalSocialMedia({
          facebook: data.professional.facebook || "",
          twitter: data.professional.twitter || "",
          instagram: data.professional.instagram || "",
          linkedin: data.professional.linkedin || "",
        });
        setProfilePictureUrl(data.professional.profilePicture || "");
        setBannerUrl(data.professional.banner || "");

        setIsCreatingProfile(false);
        toast({
          title: "Success",
          description: "Professional profile created successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to create profile: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Create error:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfessional = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!professional) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const updateData = {
      name: formData.get("name") as string,
      professionalHeadline: formData.get("professionalHeadline") as string,
      aboutMe: formData.get("aboutMe") as string,
      profilePicture: profilePictureUrl,
      banner: bannerUrl,
      location: formData.get("location") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      email: formData.get("email") as string,
      facebook: professionalSocialMedia.facebook,
      twitter: professionalSocialMedia.twitter,
      instagram: professionalSocialMedia.instagram,
      linkedin: professionalSocialMedia.linkedin,
    };

    try {
      const response = await fetch(`/api/professionals/${professional.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfessional(data.professional);

        // Update structured data in form state
        setProfessionalWorkExperience(data.professional.workExperience || []);
        setProfessionalEducation(data.professional.education || []);
        setSkills(data.professional.skills || []);
        setWorkExperience(data.professional.workExperience || []);
        setEducation(data.professional.education || []);
        setProfessionalSocialMedia({
          facebook: data.professional.facebook || "",
          twitter: data.professional.twitter || "",
          instagram: data.professional.instagram || "",
          linkedin: data.professional.linkedin || "",
        });
        setProfilePictureUrl(data.professional.profilePicture || "");
        setBannerUrl(data.professional.banner || "");

        setIsEditing(false);
        toast({
          title: "Success",
          description: "Professional profile updated successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update profile: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!professional) return;

    setIsLoading(true);
    const updateData = {
      name: professional.name,
      professionalHeadline: professional.professionalHeadline,
      aboutMe: professional.aboutMe,
      profilePicture: profilePictureUrl,
      banner: bannerUrl,
      location: professional.location,
      phone: professional.phone,
      website: professional.website,
      email: professional.email,
      facebook: professionalSocialMedia.facebook,
      twitter: professionalSocialMedia.twitter,
      instagram: professionalSocialMedia.instagram,
      linkedin: professionalSocialMedia.linkedin,
      workExperience: workExperience,
      education: education,
      skills: skills,
      servicesOffered: services,
      portfolio: portfolio,
    };

    try {
      const response = await fetch(`/api/professionals/${professional.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfessional(data.professional);

        // Update all related data sections
        setProfessionalWorkExperience(data.professional.workExperience || []);
        setProfessionalEducation(data.professional.education || []);
        setSkills(data.professional.skills || []);
        setWorkExperience(data.professional.workExperience || []);
        setEducation(data.professional.education || []);
        setProfessionalServices(data.professional.servicesOffered || []);
        setProfessionalPortfolio(data.professional.portfolio || []);
        setProfessionalSocialMedia({
          facebook: data.professional.facebook || "",
          twitter: data.professional.twitter || "",
          instagram: data.professional.instagram || "",
          linkedin: data.professional.linkedin || "",
        });
        setProfilePictureUrl(data.professional.profilePicture || "");
        setBannerUrl(data.professional.banner || "");

        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update profile: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [editingSkillItem, setEditingSkillItem] = useState<number | null>(null);
  const [skillFormData, setSkillFormData] = useState({
    name: '',
    level: 'intermediate' as 'beginner' | 'intermediate' | 'expert' | 'master'
  });

  const handleFieldUpdate = async (field: string, value: string) => {
    if (!professional) return;

    setIsLoading(true);
    const updateData = { [field]: value };

    try {
      const response = await fetch(`/api/professionals/${professional.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        setProfessional(data.professional);

        // Update local state to reflect changes
        switch (field) {
          case "name":
            setEditingName(value);
            break;
          case "professionalHeadline":
            setEditingHeadline(value);
            break;
          case "aboutMe":
            setEditingAboutMe(value);
            break;
          case "email":
            setEditingEmail(value);
            break;
          case "phone":
            setEditingPhone(value);
            // Update professional state immediately for phone
            setProfessional(prev => prev ? { ...prev, phone: value } : null);
            break;
          case "location":
            setEditingLocation(value);
            break;
          case "website":
            setEditingWebsite(value);
            break;
          case "facebook":
            setEditingFacebook(value);
            break;
          case "twitter":
            setEditingTwitter(value);
            break;
          case "instagram":
            setEditingInstagram(value);
            break;
          case "linkedin":
            setEditingLinkedin(value);
            break;
        }

        toast({
          title: "Success",
          description: `${field} updated successfully!`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update ${field}: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: `Failed to update ${field}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateServices = async (servicesToSave?: any[]) => {
    const servicesData = servicesToSave || services;
    try {
      const response = await fetch("/api/professionals/services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ services: servicesData }),
        cache: "no-store",
      });

      if (response.ok) {
        await fetchProfessionalData();
        setIsEditingServices(false);
        toast({
          title: "Success",
          description: "Services updated successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update services: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Services update error:", error);
      toast({
        title: "Error",
        description: "Failed to update services. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePortfolio = async (portfolioToSave?: any[]) => {
    const portfolioData = portfolioToSave || portfolio;
    try {
      const response = await fetch("/api/professionals/portfolio", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ portfolio: portfolioData }),
        cache: "no-store",
      });

      if (response.ok) {
        // Update local state immediately for better UX
        setPortfolio(portfolioData);
        // Then fetch latest data to ensure consistency
        await fetchProfessionalData();
        setIsEditingPortfolio(false);
        toast({
          title: "Success",
          description: "Portfolio updated successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update portfolio: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Portfolio update error:", error);
      toast({
        title: "Error",
        description: "Failed to update portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSkills = async () => {
    try {
      const response = await fetch("/api/professionals/skills", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills }),
        cache: "no-store",
      });

      if (response.ok) {
        await fetchProfessionalData();
        setIsEditingSkills(false);
        toast({
          title: "Success",
          description: "Skills updated successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update skills: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Skills update error:", error);
      toast({
        title: "Error",
        description: "Failed to update skills. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExperience = async (experienceToSave?: any[]) => {
    const experienceData = experienceToSave || workExperience;
    try {
      const response = await fetch("/api/professionals/experience", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ workExperience: experienceData }),
        cache: "no-store",
      });

      if (response.ok) {
        await fetchProfessionalData();
        toast({
          title: "Success",
          description: "Work experience updated successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update work experience: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Work experience update error:", error);
      toast({
        title: "Error",
        description: "Failed to update work experience. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEducation = async () => {
    try {
      const response = await fetch("/api/professionals/education", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ education }),
        cache: "no-store",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Education updated successfully!",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: `Failed to update education: ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Education update error:", error);
      toast({
        title: "Error",
        description: "Failed to update education. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInquiryStatusUpdate = async (
    inquiryId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(
        `/api/professionals/inquiries/${inquiryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          cache: "no-store",
        }
      );

      if (response.ok) {
        await fetchProfessionalData();
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
    }
  };


  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: BarChart3,
      mobileIcon: Home,
      value: "overview",
      mobileTitle: "Home",
    },
    {
      title: "User Profile",
      icon: User,
      mobileIcon: User,
      value: "profile",
      mobileTitle: "Profile",
    },
    // {
    //   title: "Theme Customization",
    //   icon: Palette,
    //   mobileIcon: Palette,
    //   value: "theme",
    //   mobileTitle: "Theme",
    // },
    // {
    //   title: "Settings",
    //   icon: Settings,
    //   mobileIcon: Cog,
    //   value: "settings",
    //   mobileTitle: "Settings",
    // },
  ];

  const renderSkeletonContent = () => {
    return (
      <div className="space-y-6 pb-20 md:pb-0">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2 bg-gray-200" />
          <Skeleton className="h-6 w-96 bg-gray-200" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-4 w-4 rounded bg-gray-200" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1 bg-gray-200" />
                <Skeleton className="h-3 w-32 bg-gray-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderMiddleContent = () => {
    if (isLoading) {
      return renderSkeletonContent();
    }

    switch (currentView) {
      case "overview":
        return (
          <div
            className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}
          >
            <div className="mb-8">
              <h1 className="text-lg  font-bold text-slate-800">
                Professional Dashboard Overview
              </h1>
              <p className="text-md text-gray-600">
                Welcome back! Here's your professional profile overview.
              </p>

            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Profile Views"
                value="0"
                subtitle="This month"
                icon={<Eye className="h-4 w-4 text-gray-400" />}
              />
              <StatCard
                title="Profile Status"
                value={professional?.isActive ? "Active" : "Inactive"}
                subtitle="Current status"
                icon={<UserCheck className="h-4 w-4 text-gray-400" />}
              />
              <StatCard
                title="Profile Completion"
                value={`${profileCompletion}%`}
                subtitle={getProfileCompletionStatus(profileCompletion)}
                icon={<TrendingUp className="h-4 w-4 text-gray-400" />}
              />
              <StatCard
                title="Profile URL"
                value={professional ? `/pcard/${professional.slug}` : "Not set"}
                subtitle="Your public profile"
                icon={<Globe className="h-4 w-4 text-gray-400" />}
                truncate
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ActionCard
                title="View My Profile"
                description="See how your professional profile appears to visitors"
                icon={<Eye className="h-5 w-5" />}
                buttonText="View Public Profile"
                buttonAction={() =>
                  professional &&
                  window.open(`/pcard/${professional.slug}`, "_blank")
                }
                disabled={!professional}
              />
              <ActionCard
                title="Edit Profile"
                description="Update your professional information and portfolio"
                icon={<Edit className="h-5 w-5" />}
                buttonText="Edit Profile"
                buttonAction={() => setCurrentView("profile")}
                variant="outline"
              />
            </div>

            {/* Profile Completion Progress */}
            <div className="mt-8">
              <Card className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}>
                <CardHeader>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your profile to attract more clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Completion: {profileCompletion}%</span>
                      <span className="text-sm text-gray-500">{getProfileCompletionStatus(profileCompletion)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-amber-600 h-2.5 rounded-full"
                        style={{ width: `${profileCompletion}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {profileCompletion === 100 ? "Great job! Your profile is complete." : `Complete ${100 - profileCompletion}% more to reach 100%`}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "profile":
        return (
          <div
            className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}
          >
            {!professional ? (
              <CreateProfileView
                isCreatingProfile={isCreatingProfile}
                setIsCreatingProfile={setIsCreatingProfile}
                handleCreateProfessional={handleCreateProfessional}
                professionalSocialMedia={professionalSocialMedia}
                setProfessionalSocialMedia={setProfessionalSocialMedia}
                profilePictureUrl={profilePictureUrl}
                setProfilePictureUrl={setProfilePictureUrl}
                bannerUrl={bannerUrl}
                setBannerUrl={setBannerUrl}
                isLoading={isLoading}
              />
            ) : (
              <div className="space-y-6">
                  {/* Header Section - Removed cancel button from top */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                      <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                        {getHeaderTitle()}
                      </h1>
                      <p className="text-sm md:text-base text-gray-600">
                        Your professional details
                      </p>
                    </div>
                  <div className="flex gap-3">
                      <Button
                        className={themeSettings.buttonStyle}
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>

                {/* Tab-based Navigation */}
                  <Tabs
                    value={activeProfileTab}
                    onValueChange={setActiveProfileTab}
                    className="w-full"
                  >
                    <div className="flex items-center">
                      <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-6'}`}>
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        {!isMobile && <TabsTrigger value="education">Education</TabsTrigger>}
                        {!isMobile && <TabsTrigger value="services">Services</TabsTrigger>}
                        {!isMobile && <TabsTrigger value="portfolio">Portfolio</TabsTrigger>}
                      </TabsList>
                      {isMobile && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-2">More</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setActiveProfileTab("education")}>Education</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveProfileTab("services")}>Services</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setActiveProfileTab("portfolio")}>Portfolio</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                  {/* Basic Profile Information Tab */}
                  <TabsContent value="basic" className="mt-4">
                      <div className="space-y-6">
                        <ProfileInfoCard
                          professional={professional}
                          themeSettings={themeSettings}
                          isEditingName={isEditingName}
                          isEditingHeadline={isEditingHeadline}
                          isEditingAboutMe={isEditingAboutMe}
                          isEditingEmail={isEditingEmail}
                          isEditingPhone={isEditingPhone}
                          isEditingLocation={isEditingLocation}
                          isEditingFacebook={isEditingFacebook}
                          isEditingTwitter={isEditingTwitter}
                          isEditingInstagram={isEditingInstagram}
                          isEditingLinkedin={isEditingLinkedin}
                          editingName={editingName}
                          editingHeadline={editingHeadline}
                          editingAboutMe={editingAboutMe}
                          editingEmail={editingEmail}
                          editingPhone={editingPhone}
                          editingLocation={editingLocation}
                          editingFacebook={editingFacebook}
                          editingTwitter={editingTwitter}
                          editingInstagram={editingInstagram}
                          editingLinkedin={editingLinkedin}
                          nameInputRef={nameInputRef}
                          headlineInputRef={headlineInputRef}
                          aboutMeInputRef={aboutMeInputRef}
                          emailInputRef={emailInputRef}
                          phoneInputRef={phoneInputRef}
                          locationInputRef={locationInputRef}
                          facebookInputRef={facebookInputRef}
                          twitterInputRef={twitterInputRef}
                          instagramInputRef={instagramInputRef}
                          linkedinInputRef={linkedinInputRef}
                          setIsEditingName={setIsEditingName}
                          setIsEditingHeadline={setIsEditingHeadline}
                          setIsEditingAboutMe={setIsEditingAboutMe}
                          setIsEditingEmail={setIsEditingEmail}
                          setIsEditingPhone={setIsEditingPhone}
                          setIsEditingLocation={setIsEditingLocation}
                          setIsEditingFacebook={setIsEditingFacebook}
                          setIsEditingTwitter={setIsEditingTwitter}
                          setIsEditingInstagram={setIsEditingInstagram}
                          setIsEditingLinkedin={setIsEditingLinkedin}
                          setEditingName={setEditingName}
                          setEditingHeadline={setEditingHeadline}
                          setEditingAboutMe={setEditingAboutMe}
                          setEditingEmail={setEditingEmail}
                          setEditingPhone={setEditingPhone}
                          setEditingLocation={setEditingLocation}
                          setEditingFacebook={setEditingFacebook}
                          setEditingTwitter={setEditingTwitter}
                          setEditingInstagram={setEditingInstagram}
                          setEditingLinkedin={setEditingLinkedin}
                          handleFieldUpdate={handleFieldUpdate}
                          setShowBannerModal={setShowBannerModal}
                          setShowProfilePictureModal={setShowProfilePictureModal}
                        />
                      </div>
                    </TabsContent>

                  {/* Skills & Expertise Tab */}
                    {/* Skills & Expertise Tab */}
                    <TabsContent value="skills" className="mt-4">
                      <div className="space-y-6">
                        <Button
                          onClick={() => {
                            setEditingSkillItem(null);
                            setSkillFormData({ name: '', level: 'intermediate' });
                            setShowSkillDialog(true);
                          }}
                          className={`w-full ${themeSettings.buttonStyle} ${themeSettings.borderRadius}`}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skill
                        </Button>

                        <div className="space-y-3">
                          {skills.map((item, index) => {
                            const levelColors = {
                              beginner: "text-gray-600",
                              intermediate: "text-blue-600",
                              expert: "text-purple-600",
                              master: "text-amber-600",
                            };

                            const levelLabels = {
                              beginner: "Beginner",
                              intermediate: "Intermediate",
                              expert: "Expert",
                              master: "Master",
                            };

                            const levelIcons = {
                              beginner: <Award className="h-4 w-4" />,
                              intermediate: <Award className="h-4 w-4" />,
                              expert: <Award className="h-4 w-4" />,
                              master: <Crown className="h-4 w-4" />,
                            };

                            return (
                              <Card key={index} className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}>
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    <div className="shrink-0">
                                      <div className={`w-10 h-10 rounded-lg bg-linear-to-r ${item.level === 'beginner' ? 'from-gray-100 to-gray-200' :
                                        item.level === 'intermediate' ? 'from-blue-100 to-blue-200' :
                                          item.level === 'expert' ? 'from-purple-100 to-purple-200' :
                                            'from-amber-100 to-orange-100'
                                        } flex items-center justify-center`}>
                                        <div className={levelColors[item.level]}>
                                          {levelIcons[item.level]}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-800 text-lg">
                                        {item.name}
                                      </h4>
                                      <p className={`${levelColors[item.level]} font-medium text-sm mb-1`}>
                                        {levelLabels[item.level]}
                                      </p>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingSkillItem(index);
                                          setSkillFormData(item);
                                          setShowSkillDialog(true);
                                        }}
                                        className={themeSettings.borderRadius}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          const newSkills = skills.filter((_, i) => i !== index);
                                          setSkills(newSkills);
                                          handleUpdateSkills();
                                        }}
                                        className={`${themeSettings.borderRadius} text-red-600 hover:text-red-700 hover:bg-red-50`}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>

                        <Dialog open={showSkillDialog} onOpenChange={setShowSkillDialog}>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>
                                {editingSkillItem !== null ? 'Edit' : 'Add'} Skill
                              </DialogTitle>
                              <DialogDescription>
                                {editingSkillItem !== null ? 'Update your skill details.' : 'Add your skill details.'}
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                              e.preventDefault();
                              const newSkills = editingSkillItem !== null
                                ? skills.map((item, index) => index === editingSkillItem ? skillFormData : item)
                                : [...skills, skillFormData];
                              setSkills(newSkills);
                              handleUpdateSkills();
                              setShowSkillDialog(false);
                              setEditingSkillItem(null);
                              setSkillFormData({ name: '', level: 'intermediate' });
                            }}>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Skill Name</Label>
                                  <Input
                                    value={skillFormData.name}
                                    onChange={(e) => setSkillFormData({ ...skillFormData, name: e.target.value })}
                                    placeholder="e.g., JavaScript"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Proficiency Level</Label>
                                  <Select
                                    value={skillFormData.level}
                                    onValueChange={(value) => setSkillFormData({ ...skillFormData, level: value as 'beginner' | 'intermediate' | 'expert' | 'master' })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="beginner">Beginner</SelectItem>
                                      <SelectItem value="intermediate">Intermediate</SelectItem>
                                      <SelectItem value="expert">Expert</SelectItem>
                                      <SelectItem value="master">Master</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setShowSkillDialog(false)}
                                  className={themeSettings.borderRadius}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="submit"
                                  className={themeSettings.buttonStyle}
                                >
                                  {editingSkillItem !== null ? 'Update' : 'Add'} Skill
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TabsContent>

                  {/* Work Experience Tab */}
                  <TabsContent value="experience" className="mt-4">
                    <div className="space-y-6">
                      <Button
                        onClick={() => {
                          setEditingExperienceItem(null);
                          setExperienceFormData({ position: '', company: '', location: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isCurrent: false });
                          setShowExperienceDialog(true);
                        }}
                        className={`w-full ${themeSettings.buttonStyle} ${themeSettings.borderRadius}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Work Experience
                      </Button>

                      <div className="space-y-3">
                        {workExperience.map((item, index) => (
                          <Card key={index} className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div className="shrink-0">
                                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-800 text-lg">
                                    {item.position}
                                  </h4>
                                  <p className="text-blue-600 font-medium text-sm mb-1">
                                    {item.company}{item.location ? ` • ${item.location}` : ''}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {formatDuration(item)}
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingExperienceItem(index);
                                      setExperienceFormData(item);
                                      setShowExperienceDialog(true);
                                    }}
                                    className={themeSettings.borderRadius}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newItems = workExperience.filter((_, i) => i !== index);
                                      setWorkExperience(newItems);
                                      handleUpdateExperience();
                                    }}
                                    className={`${themeSettings.borderRadius} text-red-600 hover:text-red-700 hover:bg-red-50`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Dialog open={showExperienceDialog} onOpenChange={setShowExperienceDialog}>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {editingExperienceItem !== null ? 'Edit' : 'Add'} Work Experience
                            </DialogTitle>
                            <DialogDescription>
                              {editingExperienceItem !== null ? 'Update your work experience details.' : 'Add your work experience details.'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                              const newExperience = editingExperienceItem !== null
                                ? workExperience.map((item, index) => index === editingExperienceItem ? experienceFormData : item)
                                : [...workExperience, experienceFormData];
                              handleUpdateExperience(newExperience);
                            setShowExperienceDialog(false);
                            setEditingExperienceItem(null);
                            setExperienceFormData({ position: '', company: '', location: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isCurrent: false });
                          }}>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Position/Title</Label>
                                <Input
                                  value={experienceFormData.position}
                                  onChange={(e) => setExperienceFormData({ ...experienceFormData, position: e.target.value })}
                                  placeholder="e.g., Software Engineer"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Company/Organization</Label>
                                <Input
                                  value={experienceFormData.company}
                                  onChange={(e) => setExperienceFormData({ ...experienceFormData, company: e.target.value })}
                                  placeholder="e.g., Tech Corp"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                  value={experienceFormData.location}
                                  onChange={(e) => setExperienceFormData({ ...experienceFormData, location: e.target.value })}
                                  placeholder="e.g., New York, NY"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Start Month</Label>
                                  <Select
                                    value={experienceFormData.startMonth}
                                    onValueChange={(value) => setExperienceFormData({ ...experienceFormData, startMonth: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem key={month} value={month}>
                                          {month}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Start Year</Label>
                                  <Input
                                    type="number"
                                    min="1900"
                                    max="2030"
                                    value={experienceFormData.startYear}
                                    onChange={(e) => setExperienceFormData({ ...experienceFormData, startYear: e.target.value })}
                                    placeholder="Year"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>End Month</Label>
                                  <Select
                                    value={experienceFormData.endMonth}
                                    onValueChange={(value) => setExperienceFormData({ ...experienceFormData, endMonth: value })}
                                    disabled={experienceFormData.isCurrent}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {months.map((month) => (
                                        <SelectItem key={month} value={month}>
                                          {month}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>End Year</Label>
                                  <Input
                                    type="number"
                                    min="1900"
                                    max="2030"
                                    value={experienceFormData.endYear}
                                    onChange={(e) => setExperienceFormData({ ...experienceFormData, endYear: e.target.value })}
                                    placeholder="Year"
                                    disabled={experienceFormData.isCurrent}
                                  />
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="current"
                                  checked={experienceFormData.isCurrent}
                                  onCheckedChange={(checked) => setExperienceFormData({ ...experienceFormData, isCurrent: checked === true })}
                                />
                                <Label htmlFor="current">I currently work here</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowExperienceDialog(false)}
                                className={themeSettings.borderRadius}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className={themeSettings.buttonStyle}
                              >
                                {editingExperienceItem !== null ? 'Update' : 'Add'} Experience
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="education" className="mt-4">
                    <div className="space-y-6">
                      <Button
                        onClick={() => {
                          setEditingEducationItem(null);
                          setEducationFormData({ degree: '', institution: '', year: '', description: '' });
                          setShowEducationDialog(true);
                        }}
                        className={`w-full ${themeSettings.buttonStyle} ${themeSettings.borderRadius}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>

                      <div className="space-y-3">
                          {education.map((item, index) => (
                            <Card key={index} className={`${themeSettings.cardClass}  rounded-md ${themeSettings.borderRadius}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                      <GraduationCap className="h-5 w-5 text-green-600" />
                                    </div>
                                  </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-slate-800 text-lg">
                                    {item.degree}
                                  </h4>
                                  <p className="text-green-600 font-medium text-sm mb-1">
                                    {item.institution}
                                  </p>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {item.year}
                                  </p>
                                  {item.description && (
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingEducationItem(index);
                                      setEducationFormData(item);
                                      setShowEducationDialog(true);
                                    }}
                                    className={themeSettings.borderRadius}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newItems = education.filter((_, i) => i !== index);
                                      setEducation(newItems);
                                      handleUpdateEducation();
                                    }}
                                    className={`${themeSettings.borderRadius} text-red-600 hover:text-red-700 hover:bg-red-50`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Dialog open={showEducationDialog} onOpenChange={setShowEducationDialog}>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {editingEducationItem !== null ? 'Edit' : 'Add'} Education
                            </DialogTitle>
                            <DialogDescription>
                              {editingEducationItem !== null ? 'Update your education details.' : 'Add your education details.'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            if (editingEducationItem !== null) {
                              const newItems = [...education];
                              newItems[editingEducationItem] = educationFormData;
                              setEducation(newItems);
                            } else {
                              setEducation([...education, educationFormData]);
                            }
                            handleUpdateEducation();
                            setShowEducationDialog(false);
                            setEditingEducationItem(null);
                            setEducationFormData({ degree: '', institution: '', year: '', description: '' });
                          }}>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Degree/Certificate</Label>
                                <Input
                                  value={educationFormData.degree}
                                  onChange={(e) => setEducationFormData({ ...educationFormData, degree: e.target.value })}
                                  placeholder="e.g., Bachelor of Science"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Institution</Label>
                                <Input
                                  value={educationFormData.institution}
                                  onChange={(e) => setEducationFormData({ ...educationFormData, institution: e.target.value })}
                                  placeholder="e.g., University Name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Year</Label>
                                <Input
                                  type="number"
                                  min="1900"
                                  max="2030"
                                  value={educationFormData.year}
                                  onChange={(e) => setEducationFormData({ ...educationFormData, year: e.target.value })}
                                  placeholder="e.g., 2020"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <Textarea
                                  value={educationFormData.description}
                                  onChange={(e) => setEducationFormData({ ...educationFormData, description: e.target.value })}
                                  placeholder="Additional details about your education..."
                                  rows={3}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowEducationDialog(false)}
                                className={themeSettings.borderRadius}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className={themeSettings.buttonStyle}
                              >
                                {editingEducationItem !== null ? 'Update' : 'Add'} Education
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>

                  {/* Services Offered Tab */}
                  <TabsContent value="services" className="mt-4">
                    <div className="space-y-6">
                      <Button
                        onClick={() => {
                          setEditingServicesItem(null);
                          setServicesFormData({ name: '', description: '', price: '' });
                          setShowServicesDialog(true);
                        }}
                        className={`w-full ${themeSettings.buttonStyle} ${themeSettings.borderRadius}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                      </Button>

                      <div className="space-y-3">
                          {services.map((service, index) => (
                            <Card key={index} className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                  <div className="shrink-0">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                      <Package className="h-5 w-5 text-green-600" />
                                    </div>
                                  </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 text-lg">
                                    {service.name}
                                  </h4>
                                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                    {service.description}
                                  </p>
                                  {service.price && (
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                                      {service.price}
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingServicesItem(index);
                                      setServicesFormData(service);
                                      setShowServicesDialog(true);
                                    }}
                                    className={themeSettings.borderRadius}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newItems = services.filter((_, i) => i !== index);
                                      handleUpdateServices(newItems);
                                    }}
                                    className={`${themeSettings.borderRadius} text-red-600 hover:text-red-700 hover:bg-red-50`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Dialog open={showServicesDialog} onOpenChange={setShowServicesDialog}>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>
                              {editingServicesItem !== null ? 'Edit' : 'Add'} Service
                            </DialogTitle>
                            <DialogDescription>
                              {editingServicesItem !== null ? 'Update your service details.' : 'Add your service details.'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                              const newServices = editingServicesItem !== null
                                ? services.map((item, index) => index === editingServicesItem ? servicesFormData : item)
                                : [...services, servicesFormData];
                              handleUpdateServices(newServices);
                            setShowServicesDialog(false);
                            setEditingServicesItem(null);
                            setServicesFormData({ name: '', description: '', price: '' });
                          }}>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Service Name</Label>
                                <Input
                                  value={servicesFormData.name}
                                  onChange={(e) => setServicesFormData({ ...servicesFormData, name: e.target.value })}
                                  placeholder="e.g., Web Development"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={servicesFormData.description}
                                  onChange={(e) => setServicesFormData({ ...servicesFormData, description: e.target.value })}
                                  placeholder="Describe your service..."
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Price (Optional)</Label>
                                <Input
                                  value={servicesFormData.price}
                                  onChange={(e) => setServicesFormData({ ...servicesFormData, price: e.target.value })}
                                  placeholder="e.g., $50/hour"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowServicesDialog(false)}
                                className={themeSettings.borderRadius}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className={themeSettings.buttonStyle}
                              >
                                {editingServicesItem !== null ? 'Update' : 'Add'} Service
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>

                  {/* Portfolio Tab */}
                  <TabsContent value="portfolio" className="mt-4">
                    <div className="space-y-6">
                      <Button
                        onClick={() => {
                          setEditingPortfolioItem(null);
                          setPortfolioFormData({ title: '', description: '', url: '' });
                          setShowPortfolioDialog(true);
                        }}
                        className={`w-full ${themeSettings.buttonStyle} ${themeSettings.borderRadius}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Portfolio Item
                      </Button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolio.map((item, index) => (
                          <Card key={index} className={`${themeSettings.cardClass} ${themeSettings.borderRadius} overflow-hidden`}>
                            {/* Image Display */}
                            <div className="aspect-video w-full bg-gray-100 relative">
                              {item.url && isValidImageUrl(item.url) ? (
                                <img
                                  src={item.url}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={handleImageError}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <Image className="h-12 w-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                    {item.title}
                                  </h4>
                                  {item.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex space-x-2 pt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingPortfolioItem(index);
                                      setPortfolioFormData(item);
                                      setShowPortfolioDialog(true);
                                    }}
                                    className={`flex-1 ${themeSettings.borderRadius}`}
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newItems = portfolio.filter((_, i) => i !== index);
                                      handleUpdatePortfolio(newItems);
                                    }}
                                    className={`${themeSettings.borderRadius} text-red-600 hover:text-red-700 hover:bg-red-50`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {portfolio.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No portfolio items yet
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Add your first portfolio item to showcase your work
                          </p>
                          <Button
                            onClick={() => {
                              setEditingPortfolioItem(null);
                              setPortfolioFormData({ title: '', description: '', url: '' });
                              setShowPortfolioDialog(true);
                            }}
                            className={themeSettings.buttonStyle}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Portfolio Item
                          </Button>
                        </div>
                      )}

                      <Dialog open={showPortfolioDialog} onOpenChange={setShowPortfolioDialog}>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {editingPortfolioItem !== null ? 'Edit' : 'Add'} Portfolio Item
                            </DialogTitle>
                            <DialogDescription>
                              {editingPortfolioItem !== null ? 'Update your portfolio item details.' : 'Add your portfolio item details.'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                              const newPortfolio = editingPortfolioItem !== null
                                ? portfolio.map((item, index) => index === editingPortfolioItem ? portfolioFormData : item)
                                : [...portfolio, portfolioFormData];
                              handleUpdatePortfolio(newPortfolio);
                            setShowPortfolioDialog(false);
                            setEditingPortfolioItem(null);
                            setPortfolioFormData({ title: '', description: '', url: '' });
                          }}>
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label>Title</Label>
                                  <Input
                                    value={portfolioFormData.title}
                                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, title: e.target.value })}
                                    placeholder="e.g., Website Design Project"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={portfolioFormData.description}
                                    onChange={(e) => setPortfolioFormData({ ...portfolioFormData, description: e.target.value })}
                                    placeholder="Describe your work..."
                                    rows={3}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Portfolio Image</Label>
                                  <ImageUpload
                                    onUpload={(url) => setPortfolioFormData({ ...portfolioFormData, url })}
                                    uploadUrl="/api/professionals/upload"
                                      uploadType="portfolio"

                                  />
                                  {portfolioFormData.url && (
                                    <p className="text-sm text-gray-600">
                                      Image uploaded successfully
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPortfolioDialog(false)}
                                className={themeSettings.borderRadius}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                className={themeSettings.buttonStyle}
                                disabled={!portfolioFormData.url}
                              >
                                {editingPortfolioItem !== null ? 'Update' : 'Add'} Item
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>

                    {/* Contact Information Tab */}
                    <TabsContent value="contact" className="mt-6">
                      <div className="space-y-6">
                        <Card
                          className={`${themeSettings.cardClass} ${themeSettings.borderRadius} overflow-hidden hover:shadow-xl transition-shadow duration-300`}
                        >
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Left Column - Contact Details */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                  <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                      Email
                                    </p>
                                    <p className="text-sm text-gray-900">
                                      {professional.email || "Not provided"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                  <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                      Phone
                                    </p>
                                    <p className="text-sm text-gray-900">
                                      {professional.phone || "Not provided"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                  <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                      Location
                                    </p>
                                    <p className="text-sm text-gray-900">
                                      {professional.location || "Not provided"}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                  <Globe className="h-5 w-5 text-gray-400 shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                      Website
                                    </p>
                                    <p className="text-sm text-gray-900">
                                      {professional.website ? (
                                        <a
                                          href={professional.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {professional.website}
                                        </a>
                                      ) : (
                                        "Not provided"
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {/* Right Column - Social Media Links */}
                              <div className="space-y-4">
                                <Label className="text-sm font-semibold text-gray-700">
                                  Social Media Links
                                </Label>
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Facebook className="h-5 w-5 text-blue-600 shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Facebook
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {professional.facebook ? (
                                          <a
                                            href={professional.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                          >
                                            Connected
                                          </a>
                                        ) : (
                                          "Not connected"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Twitter className="h-5 w-5 text-sky-500 shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Twitter
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {professional.twitter ? (
                                          <a
                                            href={professional.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sky-600 hover:underline"
                                          >
                                            Connected
                                          </a>
                                        ) : (
                                          "Not connected"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Instagram className="h-5 w-5 text-pink-600 shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Instagram
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {professional.instagram ? (
                                          <a
                                            href={professional.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-pink-600 hover:underline"
                                          >
                                            Connected
                                          </a>
                                        ) : (
                                          "Not connected"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <Linkedin className="h-5 w-5 text-blue-700 shrink-0" />
                                    <div className="flex-1">
                                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        LinkedIn
                                      </p>
                                      <p className="text-sm text-gray-900">
                                        {professional.linkedin ? (
                                          <a
                                            href={professional.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-700 hover:underline"
                                          >
                                            Connected
                                          </a>
                                        ) : (
                                          "Not connected"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        );

      case "inquiries":
        const filteredInquiries = inquiries.filter((inquiry: any) => {
          if (!searchTerm.trim()) {
            return true;
          }

          const normalizedSearch = searchTerm.toLowerCase();
          return (
            inquiry.name?.toLowerCase().includes(normalizedSearch) ||
            inquiry.email?.toLowerCase().includes(normalizedSearch) ||
            inquiry.message?.toLowerCase().includes(normalizedSearch) ||
            inquiry.phone?.toLowerCase().includes(normalizedSearch)
          );
        });

        return (
          <div
            className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}
          >
            <div className="mb-8">
              <h1 className="text-lg font-bold text-gray-900">
                Client Inquiries
              </h1>
              <p className="text-md text-gray-600">
                Manage inquiries from potential clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Inquiries"
                value={stats.totalInquiries}
                subtitle="All time"
                icon={<MessageSquare className="h-4 w-4 text-gray-400" />}
              />
              <StatCard
                title="New Inquiries"
                value={stats.newInquiries}
                subtitle="Requires attention"
                icon={<AlertTriangle className="h-4 w-4 text-gray-400" />}
              />
              <StatCard
                title="Response Rate"
                value={`${stats.totalInquiries > 0
                    ? Math.round(
                      ((stats.totalInquiries - stats.newInquiries) /
                        stats.totalInquiries) *
                      100
                    )
                    : 0
                  }%`}
                subtitle="Inquiries handled"
                icon={<TrendingUp className="h-4 w-4 text-gray-400" />}
              />
            </div>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardContent className="p-6">
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <Table>
                    <TableHeader className="bg-amber-100">
                      <TableRow>
                        <TableHead className="text-gray-900">Client</TableHead>
                        <TableHead className="text-gray-900">Message</TableHead>
                        <TableHead className="text-gray-900">Status</TableHead>
                        <TableHead className="text-gray-900">Date</TableHead>
                        <TableHead className="text-gray-900">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries.map((inquiry: any) => (
                        <TableRow key={inquiry.id}>
                          <TableCell className="text-gray-900">
                            <div>
                              <div className="font-medium">{inquiry.name}</div>
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
                          <TableCell className="text-gray-900 max-w-xs truncate">
                            {inquiry.message}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-full">
                              {inquiry.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-900">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className={themeSettings.borderRadius}
                                onClick={() => {
                                  setSelectedInquiry(inquiry);
                                  setShowInquiryDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {inquiry.status === "NEW" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className={themeSettings.borderRadius}
                                  onClick={() =>
                                    handleInquiryStatusUpdate(
                                      inquiry.id,
                                      "READ"
                                    )
                                  }
                                >
                                  Mark Read
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredInquiries.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? "No matching inquiries" : "No inquiries yet"}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try a different search term."
                        : "Inquiries from potential clients will appear here."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "analytics":
        return (
          <div
            className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}
          >
            <div className="mb-8">
              <h1 className="text-lg font-bold text-gray-900">
                Profile Analytics
              </h1>
              <p className="text-md text-gray-600">
                Track your profile performance and engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
              >
                <CardHeader>
                  <CardTitle>Profile Views</CardTitle>
                  <CardDescription>
                    Number of times your profile has been viewed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.profileViews}</div>
                  <p className="text-sm text-gray-500">Analytics coming soon</p>
                </CardContent>
              </Card>

              <Card
                className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
              >
                <CardHeader>
                  <CardTitle>Contact Requests</CardTitle>
                  <CardDescription>
                    Inquiries received through your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.totalInquiries}
                  </div>
                  <p className="text-sm text-gray-500">
                    Total inquiries received
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "theme":
        return (
          <div
            className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}
          >
            <div className="mb-8">
              <h1 className="text-lg font-bold text-gray-900">
                Theme Customization
              </h1>
              <p className="text-md text-gray-600">
                Customize the appearance of your dashboard and public profile.
              </p>
            </div>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Color Combination</CardTitle>
                <CardDescription>
                  Choose your primary and secondary colors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <Input
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) =>
                        updateTheme({ primaryColor: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <Input
                      type="color"
                      value={themeSettings.secondaryColor}
                      onChange={(e) =>
                        updateTheme({ secondaryColor: e.target.value })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Card Borders & Gapping</CardTitle>
                <CardDescription>
                  Adjust border radius and spacing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Select
                      value={themeSettings.borderRadius}
                      onValueChange={(value) =>
                        updateTheme({ borderRadius: value })
                      }
                    >
                      <SelectTrigger className={themeSettings.borderRadius}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded-none">None</SelectItem>
                        <SelectItem value="rounded-lg">Small</SelectItem>
                        <SelectItem value="rounded-xl">Medium</SelectItem>
                        <SelectItem value="rounded-3xl">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gapping</Label>
                    <Select
                      value={themeSettings.gap}
                      onValueChange={(value) => updateTheme({ gap: value })}
                    >
                      <SelectTrigger className={themeSettings.borderRadius}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gap-2">Tight</SelectItem>
                        <SelectItem value="gap-4">Normal</SelectItem>
                        <SelectItem value="gap-6">Relaxed</SelectItem>
                        <SelectItem value="gap-8">Loose</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Background Theme</CardTitle>
                <CardDescription>
                  Select your preferred background theme
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={themeSettings.backgroundTheme}
                  onValueChange={(value) =>
                    updateTheme({ backgroundTheme: value as any })
                  }
                >
                  <SelectTrigger className={themeSettings.borderRadius}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>Customize font styles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select
                      value={themeSettings.fontFamily}
                      onValueChange={(value) =>
                        updateTheme({ fontFamily: value })
                      }
                    >
                      <SelectTrigger className={themeSettings.borderRadius}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="font-sans">Sans Serif</SelectItem>
                        <SelectItem value="font-serif">Serif</SelectItem>
                        <SelectItem value="font-mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Select
                      value={themeSettings.fontSize}
                      onValueChange={(value) =>
                        updateTheme({ fontSize: value })
                      }
                    >
                      <SelectTrigger className={themeSettings.borderRadius}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text-sm">Small</SelectItem>
                        <SelectItem value="text-base">Medium</SelectItem>
                        <SelectItem value="text-lg">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Component Styles</CardTitle>
                <CardDescription>
                  Customize the appearance of UI components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Card Style</Label>
                    <Select
                      value={themeSettings.cardStyle}
                      onValueChange={(value) =>
                        updateTheme({ cardStyle: value })
                      }
                    >
                      <SelectTrigger className={themeSettings.borderRadius}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shadow-sm">Subtle</SelectItem>
                        <SelectItem value="shadow-lg">Standard</SelectItem>
                        <SelectItem value="shadow-xl">Pronounced</SelectItem>
                        <SelectItem value="shadow-2xl">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Button Style</Label>
                    <Select
                      value={themeSettings.buttonStyle}
                      onValueChange={(value) =>
                        updateTheme({ buttonStyle: value })
                      }
                    >
                      <SelectTrigger className={themeSettings.borderRadius}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rounded-lg">Small</SelectItem>
                        <SelectItem value="rounded-xl">Medium</SelectItem>
                        <SelectItem value="rounded-3xl">Large</SelectItem>
                        <SelectItem value="rounded-full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={() => {
                  toast({
                    title: "Success",
                    description: "Theme settings saved successfully!",
                  });
                }}
                className={`flex-1 ${themeSettings.buttonStyle}`}
              >
                Save Theme
              </Button>
              <Button
                variant="outline"
                onClick={resetTheme}
                className={`flex-1 ${themeSettings.borderRadius}`}
              >
                Reset to Default
              </Button>
            </div>
          </div>
        );

      case "settings":
        return (
          <div
            className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}
          >
            <div className="mb-8">
              <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                Account Settings
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                Manage your account preferences and security.
              </p>
            </div>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={user?.name || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={user?.email || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={user?.role || ""}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <Input
                      value={
                        user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : ""
                      }
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Login Credentials</CardTitle>
                <CardDescription>Manage your login information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Email</Label>
                  <Input
                    value={user?.email || ""}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <Button variant="outline">Change Password</Button>
              </CardContent>
            </Card>

            <Card
              className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
            >
              <CardHeader>
                <CardTitle>Plans Information</CardTitle>
                <CardDescription>
                  Your current subscription plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Free Plan</div>
                <p className="text-sm text-gray-500">
                  Upgrade to access more features
                </p>
                <Button className={`mt-4 ${themeSettings.buttonStyle}`}>
                  Upgrade Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Select a menu item</div>;
    }
  };

  // Reusable Components

  const StatCard = ({ title, value, subtitle, icon, truncate = false }: any) => (
    <Card
      className={`${themeSettings.cardClass} ${themeSettings.borderRadius} transition-all duration-300 hover:shadow-lg`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-900">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold text-gray-900 ${truncate ? "truncate" : ""
            }`}
        >
          {value}
        </div>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );

  const ActionCard = ({
    title,
    description,
    icon,
    buttonText,
    buttonAction,
    disabled = false,
    variant = "default",
  }: {
    title: string;
    description: string;
    icon: any;
    buttonText: string;
    buttonAction: () => void;
    disabled?: boolean;
    variant?: ButtonVariant;
  }) => (
    <Card
      className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className={`w-full ${variant === "outline" ? "" : themeSettings.buttonStyle
            }`}
          variant={variant}
          onClick={buttonAction}
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );

  const CreateProfileView = ({
    isCreatingProfile,
    setIsCreatingProfile,
    handleCreateProfessional,
    professionalSocialMedia,
    setProfessionalSocialMedia,
    profilePictureUrl,
    setProfilePictureUrl,
    bannerUrl,
    setBannerUrl,
    isLoading,
  }: any) => (
    <div className="space-y-6">
      {/* Create Profile Prompt */}
      <Card
        className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Professional Profile Found
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't created your professional profile yet. Create one to
              showcase your services and attract clients.
            </p>
            <Button
              onClick={() => setIsCreatingProfile(true)}
              className={themeSettings.buttonStyle}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Professional Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {isCreatingProfile && (
        <form onSubmit={handleCreateProfessional} className="space-y-6">
          {/* Basic Information */}
          <Card
            className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Professional Name *</Label>
                  <Input
                    name="name"
                    required
                    className={themeSettings.borderRadius}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Professional Headline</Label>
                  <Input
                    name="professionalHeadline"
                    className={themeSettings.borderRadius}
                  />
                </div>
                <div className="space-y-2">
                  <Label>About Me</Label>
                  <Textarea
                    name="aboutMe"
                    className={themeSettings.borderRadius}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <ImageUpload
                      onUpload={setProfilePictureUrl}
                      className="max-w-md"
                      uploadUrl="/api/professionals/upload"
                      uploadType="profile"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Banner Image</Label>
                    <ImageUpload
                      onUpload={setBannerUrl}
                      className="max-w-md"
                      uploadUrl="/api/professionals/upload"
                      uploadType="banner"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      name="location"
                      className={themeSettings.borderRadius}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      className={themeSettings.borderRadius}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      name="website"
                      className={themeSettings.borderRadius}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      name="email"
                      type="email"
                      className={themeSettings.borderRadius}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card
            className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <GlobeIcon className="h-5 w-5 mr-2" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Facebook className="h-4 w-4 mr-2 text-amber-600" />
                    Facebook
                  </Label>
                  <Input
                    value={professionalSocialMedia.facebook}
                    onChange={(e) =>
                      setProfessionalSocialMedia((prev: any) => ({
                        ...prev,
                        facebook: e.target.value,
                      }))
                    }
                    placeholder="https://facebook.com/username"
                    className={themeSettings.borderRadius}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Twitter className="h-4 w-4 mr-2 text-amber-400" />
                    Twitter
                  </Label>
                  <Input
                    value={professionalSocialMedia.twitter}
                    onChange={(e) =>
                      setProfessionalSocialMedia((prev: any) => ({
                        ...prev,
                        twitter: e.target.value,
                      }))
                    }
                    placeholder="https://twitter.com/username"
                    className={themeSettings.borderRadius}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    value={professionalSocialMedia.instagram}
                    onChange={(e) =>
                      setProfessionalSocialMedia((prev: any) => ({
                        ...prev,
                        instagram: e.target.value,
                      }))
                    }
                    placeholder="https://instagram.com/username"
                    className={themeSettings.borderRadius}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2 text-amber-700" />
                    LinkedIn
                  </Label>
                  <Input
                    value={professionalSocialMedia.linkedin}
                    onChange={(e) =>
                      setProfessionalSocialMedia((prev: any) => ({
                        ...prev,
                        linkedin: e.target.value,
                      }))
                    }
                    placeholder="https://linkedin.com/in/username"
                    className={themeSettings.borderRadius}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${themeSettings.buttonStyle}`}
            >
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreatingProfile(false)}
              className={`flex-1 ${themeSettings.borderRadius}`}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );

  const EditProfileForm = ({
    professional,
    handleUpdateProfessional,
    professionalSocialMedia,
    setProfessionalSocialMedia,
    profilePictureUrl,
    setProfilePictureUrl,
    bannerUrl,
    setBannerUrl,
    professionalServices,
    setProfessionalServices,
    professionalPortfolio,
    setProfessionalPortfolio,
    isLoading,
  }: any) => (
    <form onSubmit={handleUpdateProfessional} className="space-y-6">
      {/* Basic Information */}
      <Card
        className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label>Professional Name</Label>
              <Input
                name="name"
                defaultValue={professional.name}
                required
                className={themeSettings.borderRadius}
              />
            </div>
            <div className="space-y-2">
              <Label>Professional Headline</Label>
              <Input
                name="professionalHeadline"
                defaultValue={professional.professionalHeadline || ""}
                className={themeSettings.borderRadius}
              />
            </div>
            <div className="space-y-2">
              <Label>About Me</Label>
              <Textarea
                name="aboutMe"
                defaultValue={professional.aboutMe || ""}
                className={themeSettings.borderRadius}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <ImageUpload
                  onUpload={setProfilePictureUrl}
                  className="max-w-md"
                  uploadUrl="/api/professionals/upload"
                  uploadType="profile"
                />
                {profilePictureUrl && (
                  <p className="text-sm text-gray-600">
                    Current: {profilePictureUrl}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <ImageUpload
                  onUpload={setBannerUrl}
                  className="max-w-md"
                  uploadUrl="/api/professionals/upload"
                  uploadType="banner"
                />
                {bannerUrl && (
                  <p className="text-sm text-gray-600">Current: {bannerUrl}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  name="location"
                  defaultValue={professional.location || ""}
                  className={themeSettings.borderRadius}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  name="phone"
                  defaultValue={professional.phone || ""}
                  className={themeSettings.borderRadius}
                />
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  name="website"
                  defaultValue={professional.website || ""}
                  className={themeSettings.borderRadius}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  name="email"
                  defaultValue={professional.email || ""}
                  type="email"
                  className={themeSettings.borderRadius}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card
        className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <GlobeIcon className="h-5 w-5 mr-2" />
            Social Media Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Facebook className="h-4 w-4 mr-2 text-amber-600" />
                Facebook
              </Label>
              <Input
                value={professionalSocialMedia.facebook}
                onChange={(e) =>
                  setProfessionalSocialMedia((prev: any) => ({
                    ...prev,
                    facebook: e.target.value,
                  }))
                }
                placeholder="https://facebook.com/username"
                className={themeSettings.borderRadius}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Twitter className="h-4 w-4 mr-2 text-amber-400" />
                Twitter
              </Label>
              <Input
                value={professionalSocialMedia.twitter}
                onChange={(e) =>
                  setProfessionalSocialMedia((prev: any) => ({
                    ...prev,
                    twitter: e.target.value,
                  }))
                }
                placeholder="https://twitter.com/username"
                className={themeSettings.borderRadius}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                Instagram
              </Label>
              <Input
                value={professionalSocialMedia.instagram}
                onChange={(e) =>
                  setProfessionalSocialMedia((prev: any) => ({
                    ...prev,
                    instagram: e.target.value,
                  }))
                }
                placeholder="https://instagram.com/username"
                className={themeSettings.borderRadius}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center">
                <Linkedin className="h-4 w-4 mr-2 text-amber-700" />
                LinkedIn
              </Label>
              <Input
                value={professionalSocialMedia.linkedin}
                onChange={(e) =>
                  setProfessionalSocialMedia((prev: any) => ({
                    ...prev,
                    linkedin: e.target.value,
                  }))
                }
                placeholder="https://linkedin.com/in/username"
                className={themeSettings.borderRadius}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card
        className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
      >
        <CardContent className="p-6">
          <ArrayFieldManager
            title="Services Offered"
            items={professionalServices}
            onChange={setProfessionalServices}
            renderItem={(service: any, index: number) => (
              <div>
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-sm text-gray-600">{service.description}</p>
                {service.price && (
                  <p className="text-amber-600 font-medium">{service.price}</p>
                )}
              </div>
            )}
            createNewItem={() => ({ name: "", description: "", price: "" })}
            renderForm={(
              item: any,
              onSave: (item: any) => void,
              onCancel: () => void
            ) => (
              <ServiceForm item={item} onSave={onSave} onCancel={onCancel} />
            )}
            itemName="Service"
          />
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card
        className={`${themeSettings.cardClass} ${themeSettings.borderRadius}`}
      >
        <CardContent className="p-6">
          <ArrayFieldManager
            title="Portfolio"
            items={professionalPortfolio}
            onChange={setProfessionalPortfolio}
            renderItem={(item: any, index: number) => (
              <div>
                <h4 className="font-semibold">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-gray-600">{item.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  {item.type === "video" ? "Video" : "Image"}
                </p>
              </div>
            )}
            createNewItem={() => ({
              title: "",
              description: "",
              url: "",
              type: "image",
            })}
            renderForm={(
              item: any,
              onSave: (item: any) => void,
              onCancel: () => void
            ) => (
              <PortfolioItemForm
                item={item}
                onSave={onSave}
                onCancel={onCancel}
              />
            )}
            itemName="Portfolio Item"
          />
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className={`flex-1 ${themeSettings.buttonStyle}`}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          className={`flex-1 ${themeSettings.borderRadius}`}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  const ProfileInfoCard = ({
    professional,
    themeSettings,
    isEditingName,
    isEditingHeadline,
    isEditingAboutMe,
    isEditingEmail,
    isEditingPhone,
    isEditingLocation,
    isEditingFacebook,
    isEditingTwitter,
    isEditingInstagram,
    isEditingLinkedin,
    editingName,
    editingHeadline,
    editingAboutMe,
    editingEmail,
    editingPhone,
    editingLocation,
    editingFacebook,
    editingTwitter,
    editingInstagram,
    editingLinkedin,
    nameInputRef,
    headlineInputRef,
    aboutMeInputRef,
    emailInputRef,
    phoneInputRef,
    locationInputRef,
    facebookInputRef,
    twitterInputRef,
    instagramInputRef,
    linkedinInputRef,
    setIsEditingName,
    setIsEditingHeadline,
    setIsEditingAboutMe,
    setIsEditingEmail,
    setIsEditingPhone,
    setIsEditingLocation,
    setIsEditingFacebook,
    setIsEditingTwitter,
    setIsEditingInstagram,
    setIsEditingLinkedin,
    setEditingName,
    setEditingHeadline,
    setEditingAboutMe,
    setEditingEmail,
    setEditingPhone,
    setEditingLocation,
    setEditingFacebook,
    setEditingTwitter,
    setEditingInstagram,
    setEditingLinkedin,
    handleFieldUpdate,
    setShowBannerModal,
    setShowProfilePictureModal
  }: any) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">
                Banner Image
              </Label>
              <div
                className="relative group cursor-pointer"
                onClick={() => setShowBannerModal(true)}
              >
                <div className="w-full aspect-3/1 rounded-xl overflow-hidden border-4 border-white shadow-lg">
                  {professional.banner && isValidImageUrl(professional.banner) ? (
                    <img
                      src={professional.banner}
                      alt="Profile banner"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                {/* Small edit icon in top corner */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Edit className="h-3 w-3 text-gray-700" />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Recommended dimensions: 1200x300px • Click to edit
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="shrink-0 flex flex-col items-center space-y-2 mt-6 md:mt-0">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => setShowProfilePictureModal(true)}
                >
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {professional.profilePicture && isValidImageUrl(professional.profilePicture) ? (
                      <img
                        src={professional.profilePicture}
                        alt={professional.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {/* Small edit icon in top corner */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Edit className="h-3 w-3 text-gray-700" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {/* Professional Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Name
                      </p>
                      {isEditingName ? (
                        <Input
                          key="name-input"
                          ref={nameInputRef}
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="mt-1"
                          autoFocus
                        />
                      ) : (
                        <p className="text-md text-gray-900 font-medium ">
                          {professional.name || "Not provided"}
                        </p>
                      )}
                    </div>
                    {isEditingName ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await handleFieldUpdate("name", editingName);
                            // Update professional state immediately
                            setProfessional(prev => prev ? { ...prev, name: editingName } : null);
                            setIsEditingName(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingName(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`${themeSettings.borderRadius} shrink-0`}
                        onClick={() => {
                          setEditingName(professional.name || "");
                          setIsEditingName(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Professional Headline */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Edit className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Headline
                      </p>
                      {isEditingHeadline ? (
                        <Input
                          key="headline-input"
                          ref={headlineInputRef}
                          value={editingHeadline}
                          onChange={(e) => setEditingHeadline(e.target.value)}
                          className="mt-1"
                          autoFocus
                        />
                      ) : (
                        <p className="text-md text-amber-600 font-medium">
                          {professional.professionalHeadline ||
                            "Not provided"}
                        </p>
                      )}
                    </div>
                    {isEditingHeadline ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await handleFieldUpdate(
                              "professionalHeadline",
                              editingHeadline
                            );
                            // Update professional state immediately
                            setProfessional(prev => prev ? { ...prev, professionalHeadline: editingHeadline } : null);
                            setIsEditingHeadline(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingHeadline(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`${themeSettings.borderRadius} shrink-0`}
                        onClick={() => {
                          setEditingHeadline(
                            professional.professionalHeadline || ""
                          );
                          setIsEditingHeadline(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      {isEditingEmail ? (
                        <Input
                          key="email-input"
                          ref={emailInputRef}
                          value={editingEmail}
                          onChange={(e) => setEditingEmail(e.target.value)}
                          type="email"
                          className="mt-1"
                          autoFocus
                        />
                      ) : (
                        <p className="text-md text-gray-900 font-medium">
                          {professional.email || "Not provided"}
                        </p>
                      )}
                    </div>
                    {isEditingEmail ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await handleFieldUpdate("email", editingEmail);
                            // Update professional state immediately
                            setProfessional(prev => prev ? { ...prev, email: editingEmail } : null);
                            setIsEditingEmail(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingEmail(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`${themeSettings.borderRadius} shrink-0`}
                        onClick={() => {
                          setEditingEmail(professional.email || "");
                          setIsEditingEmail(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Phone */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Phone
                      </p>
                      {isEditingPhone ? (
                        <Input
                          key="phone-input"
                          ref={phoneInputRef}
                          value={editingPhone}
                          onChange={(e) => setEditingPhone(e.target.value)}
                          className="mt-1"
                          autoFocus
                        />
                      ) : (
                        <p className="text-md text-gray-900 font-medium">
                          {professional.phone || "Not provided"}
                        </p>
                      )}
                    </div>
                    {isEditingPhone ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await handleFieldUpdate("phone", editingPhone);
                            // Update professional state immediately
                            setProfessional(prev => prev ? { ...prev, phone: editingPhone } : null);
                            setIsEditingPhone(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingPhone(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`${themeSettings.borderRadius} shrink-0`}
                        onClick={() => {
                          setEditingPhone(professional.phone || "");
                          setIsEditingPhone(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Location
                      </p>
                      {isEditingLocation ? (
                        <Input
                          key="location-input"
                          ref={locationInputRef}
                          value={editingLocation}
                          onChange={(e) => setEditingLocation(e.target.value)}
                          className="mt-1"
                          autoFocus
                        />
                      ) : (
                        <p className="text-md text-gray-900 font-medium">
                          {professional.location || "Not provided"}
                        </p>
                      )}
                    </div>
                    {isEditingLocation ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await handleFieldUpdate("location", editingLocation);
                            // Update professional state immediately
                            setProfessional(prev => prev ? { ...prev, location: editingLocation } : null);
                            setIsEditingLocation(false);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingLocation(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`${themeSettings.borderRadius} shrink-0`}
                        onClick={() => {
                          setEditingLocation(professional.location || "");
                          setIsEditingLocation(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About Me - Fifth */}
            <div className="space-y-2">
              <div className="flex px-2 w-full justify-between">
              <Label className="text-sm font-semibold text-gray-700">
                About Me
                </Label>
                {isEditingAboutMe ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        await handleFieldUpdate("aboutMe", editingAboutMe);
                        // Update professional state immediately
                        setProfessional(prev => prev ? { ...prev, aboutMe: editingAboutMe } : null);
                        setIsEditingAboutMe(false);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditingAboutMe(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className={themeSettings.borderRadius}
                    onClick={() => {
                      setEditingAboutMe(professional.aboutMe || "");
                      setIsEditingAboutMe(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isEditingAboutMe ? (
                <Textarea
                  key="about-me-input"
                  ref={aboutMeInputRef}
                  value={editingAboutMe}
                  onChange={(e) => setEditingAboutMe(e.target.value)}
                  placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                  className={` rounded-lg border-gray-200 min-h-[120px] leading-relaxed`}
                  autoFocus
                />
              ) : (
                <Textarea
                  value={professional.aboutMe || ""}
                  readOnly
                  placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                    className={`rounded-lg bg-gray-50 border-gray-200 min-h-[120px] leading-relaxed`}
                />
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {professional.aboutMe
                    ? `${professional.aboutMe.length} characters`
                    : "0 characters"}
                </span>

              </div>
            </div>
          </div>

          {/* Right Column - Resume Upload & Social Media Links */}
          <div className="space-y-6">
            {/* Resume Upload Section */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">
                Resume/CV
              </Label>
              <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                {/* Current Resume Display */}
                {professional?.resume ? (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Current Resume
                        </p>
                        <p className="text-sm line-clamp-1 text-gray-500">
                          {professional.resume.split('/').pop()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className={themeSettings.borderRadius}
                        onClick={() => {
                          if (professional.resume) {
                            const link = document.createElement('a');
                            link.href = professional.resume as string;
                            link.download = (professional.resume as string).split('/').pop() || 'resume.pdf';
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${themeSettings.borderRadius} text-red-600 hover:text-red-700 hover:bg-red-50`}
                        onClick={async () => {
                          try {
                            setIsLoading(true);
                            const response = await fetch(`/api/professionals/${professional.id}`, {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ resume: null }),
                            });

                            if (response.ok) {
                              const data = await response.json();
                              setProfessional(data.professional);
                              toast({
                                title: "Success",
                                description: "Resume removed successfully!",
                              });
                            } else {
                              const error = await response.json();
                              toast({
                                title: "Error",
                                description: `Failed to remove resume: ${error.error}`,
                                variant: "destructive",
                              });
                            }
                          } catch (error) {
                            console.error("Remove resume error:", error);
                            toast({
                              title: "Error",
                              description: "Failed to remove resume. Please try again.",
                              variant: "destructive",
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-white">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No resume uploaded yet</p>
                  </div>
                )}

                {/* Resume Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Upload Resume (PDF only, max 5MB)
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf"
                      id="resume-upload-inline"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Validate file type
                        if (file.type !== 'application/pdf') {
                          toast({
                            title: "Invalid File Type",
                            description: "Please upload a PDF file only.",
                            variant: "destructive",
                          });
                          return;
                        }

                        // Validate file size (5MB max)
                        const maxSize = 5 * 1024 * 1024; // 5MB
                        if (file.size > maxSize) {
                          toast({
                            title: "File Too Large",
                            description: "Maximum file size is 5MB.",
                            variant: "destructive",
                          });
                          return;
                        }

                        try {
                          setIsLoading(true);

                          const formData = new FormData();
                          formData.append('file', file);
                          formData.append('type', 'resume');

                          const response = await fetch('/api/professionals/upload', {
                            method: 'POST',
                            body: formData,
                          });

                          if (response.ok) {
                            const data = await response.json();

                            // Update professional with new resume URL
                            const updateResponse = await fetch(`/api/professionals/${professional.id}`, {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ resume: data.url }),
                            });

                            if (updateResponse.ok) {
                              const updateData = await updateResponse.json();
                              setProfessional(updateData.professional);

                              toast({
                                title: "Success",
                                description: "Resume uploaded successfully!",
                              });
                            } else {
                              const error = await updateResponse.json();
                              toast({
                                title: "Error",
                                description: `Failed to update profile: ${error.error}`,
                                variant: "destructive",
                              });
                            }
                          } else {
                            const error = await response.json();
                            toast({
                              title: "Upload Error",
                              description: error.error || "Failed to upload resume.",
                              variant: "destructive",
                            });
                          }
                        } catch (error) {
                          console.error("Upload error:", error);
                          toast({
                            title: "Error",
                            description: "Failed to upload resume. Please try again.",
                            variant: "destructive",
                          });
                        } finally {
                          setIsLoading(false);
                          // Reset file input
                          const input = document.getElementById('resume-upload-inline') as HTMLInputElement;
                          if (input) input.value = '';
                        }
                      }}
                    />
                    <Label
                      htmlFor="resume-upload-inline"
                      className={`flex-1 cursor-pointer ${themeSettings.borderRadius} border-2 border-dashed border-gray-300 hover:border-amber-300 hover:bg-amber-50 transition-colors flex items-center justify-center py-6`}
                    >
                      <div className="text-center">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF files only (max 5MB)
                        </p>
                      </div>
                    </Label>
                  </div>
                </div>

                {/* Upload Instructions */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800 space-y-1">
                      <p className="font-medium">Upload Guidelines:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>File format: PDF only</li>
                        <li>Maximum file size: 5MB</li>

                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700">
                Social Media Links
              </Label>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Facebook className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Facebook
                    </p>
                    {isEditingFacebook ? (
                      <Input
                        key="facebook-input"
                        ref={facebookInputRef}
                        value={editingFacebook}
                        onChange={(e) => setEditingFacebook(e.target.value)}
                        placeholder="https://facebook.com/username"
                        className="mt-1"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {professional.facebook ? (
                          <a
                            href={professional.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Connected
                          </a>
                        ) : (
                          "Not connected"
                        )}
                      </p>
                    )}
                  </div>
                  {isEditingFacebook ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          await handleFieldUpdate("facebook", editingFacebook);
                          // Update professional state immediately
                          setProfessional(prev => prev ? { ...prev, facebook: editingFacebook } : null);
                          setIsEditingFacebook(false);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingFacebook(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`${themeSettings.borderRadius} shrink-0`}
                      onClick={() => {
                        setEditingFacebook(professional.facebook || "");
                        setIsEditingFacebook(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Twitter className="h-5 w-5 text-sky-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Twitter
                    </p>
                    {isEditingTwitter ? (
                      <Input
                        key="twitter-input"
                        ref={twitterInputRef}
                        value={editingTwitter}
                        onChange={(e) => setEditingTwitter(e.target.value)}
                        placeholder="https://twitter.com/username"
                        className="mt-1"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {professional.twitter ? (
                          <a
                            href={professional.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 hover:underline"
                          >
                            Connected
                          </a>
                        ) : (
                          "Not connected"
                        )}
                      </p>
                    )}
                  </div>
                  {isEditingTwitter ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          await handleFieldUpdate("twitter", editingTwitter);
                          // Update professional state immediately
                          setProfessional(prev => prev ? { ...prev, twitter: editingTwitter } : null);
                          setIsEditingTwitter(false);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingTwitter(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`${themeSettings.borderRadius} shrink-0`}
                      onClick={() => {
                        setEditingTwitter(professional.twitter || "");
                        setIsEditingTwitter(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Instagram className="h-5 w-5 text-pink-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Instagram
                    </p>
                    {isEditingInstagram ? (
                      <Input
                        key="instagram-input"
                        ref={instagramInputRef}
                        value={editingInstagram}
                        onChange={(e) => setEditingInstagram(e.target.value)}
                        placeholder="https://instagram.com/username"
                        className="mt-1"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {professional.instagram ? (
                          <a
                            href={professional.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:underline"
                          >
                            Connected
                          </a>
                        ) : (
                          "Not connected"
                        )}
                      </p>
                    )}
                  </div>
                  {isEditingInstagram ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          await handleFieldUpdate("instagram", editingInstagram);
                          // Update professional state immediately
                          setProfessional(prev => prev ? { ...prev, instagram: editingInstagram } : null);
                          setIsEditingInstagram(false);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingInstagram(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`${themeSettings.borderRadius} shrink-0`}
                      onClick={() => {
                        setEditingInstagram(professional.instagram || "");
                        setIsEditingInstagram(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Linkedin className="h-5 w-5 text-blue-700 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      LinkedIn
                    </p>
                    {isEditingLinkedin ? (
                      <Input
                        key="linkedin-input"
                        ref={linkedinInputRef}
                        value={editingLinkedin}
                        onChange={(e) => setEditingLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="mt-1"
                        autoFocus
                      />
                    ) : (
                      <p className="text-sm text-gray-900">
                        {professional.linkedin ? (
                          <a
                            href={professional.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:underline"
                          >
                            Connected
                          </a>
                        ) : (
                          "Not connected"
                        )}
                      </p>
                    )}
                  </div>
                  {isEditingLinkedin ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={async () => {
                          await handleFieldUpdate("linkedin", editingLinkedin);
                          // Update professional state immediately
                          setProfessional(prev => prev ? { ...prev, linkedin: editingLinkedin } : null);
                          setIsEditingLinkedin(false);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingLinkedin(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`${themeSettings.borderRadius} shrink-0`}
                      onClick={() => {
                        setEditingLinkedin(professional.linkedin || "");
                        setIsEditingLinkedin(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileSectionCard = ({
    title,
    items,
    isEditing,
    setIsEditing,
    handleUpdate,
    emptyMessage,
    renderItem,
    renderGrid = false,
    formComponent,
    itemName,
    setItems,
    icon: IconComponent,
  }: any) => (
    <Card
      className={`${themeSettings.cardClass} ${themeSettings.borderRadius} overflow-hidden hover:shadow-xl transition-shadow duration-300`}
    >
      <CardContent className="p-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className={`${themeSettings.borderRadius} border-gray-300 hover:border-amber-300 hover:bg-amber-50 transition-colors`}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
        {isEditing ? (
          <div className="space-y-6 animate-fadeIn">
            <ArrayFieldManager
              title=""
              items={items}
              onChange={(items) => { setItems(items); handleUpdate(); }}
              renderItem={renderItem}
              createNewItem={() => ({})}
              renderForm={(item, onSave, onCancel) =>
                React.createElement(formComponent, { item, onSave, onCancel })
              }
              itemName={itemName}
            />
          </div>
        ) : (
            <div className="animate-fadeIn">
              {renderGrid ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.length > 0 ? (
                    items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="transform hover:scale-105 transition-transform duration-200"
                    >
                      {renderItem(item, index)}
                    </div>
                  ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          {IconComponent ? (
                            <IconComponent className="h-8 w-8 text-gray-400" />
                          ) : (
                            <Plus className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No {title.toLowerCase()} yet
                        </h3>
                        <p className="text-gray-500 mb-4">{emptyMessage}</p>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                        className={`${themeSettings.borderRadius} border-dashed border-2 border-gray-300 hover:border-amber-300 hover:bg-amber-50`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First {itemName}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {items.length > 0 ? (
                    items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="transform hover:translate-x-1 transition-transform duration-200"
                    >
                      {renderItem(item, index)}
                    </div>
                  ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            {IconComponent ? (
                              <IconComponent className="h-8 w-8 text-gray-400" />
                            ) : (
                              <Plus className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No {title.toLowerCase()} yet
                          </h3>
                          <p className="text-gray-500 mb-4">{emptyMessage}</p>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                        className={`${themeSettings.borderRadius} border-dashed border-2 border-gray-300 hover:border-amber-300 hover:bg-amber-50`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First {itemName}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
        )}
      </CardContent>
    </Card>
  );

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out;
    }
  `;
    document.head.appendChild(style);

    // Cleanup function to remove the style when component unmounts
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen relative flex flex-col">
        <div className="fixed inset-0 bg-slate-200 -z-10"></div>
        {/* Top Header Bar */}
        <div className="bg-white border rounded-3xl mt-3 mx-3 border-gray-200 shadow-sm">
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
            <div className="w-64 m-4 border rounded-3xl bg-white border-r border-gray-200 flex flex-col shadow-sm overflow-auto hide-scrollbar">
              <div className="p-4 border-b border-gray-200 rounded-t-3xl">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
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
            <div className="flex-1 p-4 max-w-7xl mx-auto sm:p-6 overflow-auto hide-scrollbar">
              {renderSkeletonContent()}
            </div>
          </div>
        </div>

        {/* Inquiry Details Dialog */}
        <Dialog open={showInquiryDialog} onOpenChange={setShowInquiryDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>
                Review and respond to this client inquiry
              </DialogDescription>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Client Name</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedInquiry.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedInquiry.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedInquiry.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className="rounded-full">
                        {selectedInquiry.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Message</Label>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium">Date Received</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowInquiryDialog(false);
                      setSelectedInquiry(null);
                    }}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {selectedInquiry.status === "NEW" && (
                    <Button
                      onClick={() => {
                        handleInquiryStatusUpdate(selectedInquiry.id, "READ");
                        setShowInquiryDialog(false);
                        setSelectedInquiry(null);
                      }}
                      className="flex-1"
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl border-t border-gray-200 z-40">
            <div className="flex justify-around items-center py-2">
              {Array.from({ length: 4 }).map((_, i) => (
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

  if (!user || user.role !== ("PROFESSIONAL_ADMIN" as UserRole)) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex h-screen relative">
        <div className="fixed inset-0 bg-slate-200 -z-10"></div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Desktop Only */}
          {!isMobile && (
            <SharedSidebar
              navLinks={menuItems}
              currentView={currentView}
              onViewChange={(view) => {
                setCurrentView(view);
                if (view === "profile") setActiveProfileTab("basic");
              }}
              onLogout={async () => {
                await logout();
                router.push("/login");
              }}
              onSettings={() => setCurrentView("settings")}
              onCollapsedChange={setSidebarCollapsed}
              isMobile={isMobile}
              headerTitle="Professional"
              headerIcon={User}
            />
          )}

          {/* Mobile Bottom Navigation */}
          {isMobile && (
            <SharedSidebar
              navLinks={menuItems}
              currentView={currentView}
              onViewChange={(view) => {
                setCurrentView(view);
                if (view === "profile") setActiveProfileTab("basic");
              }}
              onLogout={async () => {
                await logout();
                router.push("/login");
              }}
              onSettings={() => setCurrentView("settings")}
              onCollapsedChange={setSidebarCollapsed}
              isMobile={isMobile}
              headerTitle="Professional"
              headerIcon={User}
            />
          )}

          {/* Middle Content with Header */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <SharedDashboardHeader
              title="Professional"
              userName={user?.name || "Professional"}
              userEmail={user?.email}
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder={getProfessionalSearchPlaceholder()}
              rightActions={
                professional ? (
                  <>
                    <div className="flex md:hidden">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/pcard/${professional.slug}`, "_blank")
                        }
                        className="rounded-full px-3 py-0 bg-[#080322] text-white border-0 hover:opacity-90 transition-opacity"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                        <span className="text-xs">View</span>
                      </Button>
                    </div>
                    <div className="hidden md:block">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(`/pcard/${professional.slug}`, "_blank")
                        }
                        className="rounded-full px-4 py-0 bg-[#080322] text-white border-0 hover:opacity-90 transition-opacity"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                        <ExternalLink className="h-3 w-3 ml-2 opacity-80" />
                      </Button>
                    </div>
                  </>
                ) : null
              }
              avatar={
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                  {profilePictureUrl && isValidImageUrl(profilePictureUrl) ? (
                    <img
                      src={getOptimizedImageUrl(profilePictureUrl, {
                        width: 32,
                        height: 32,
                        quality: 85,
                        format: "auto",
                        crop: "fill",
                        gravity: "center",
                      })}
                      alt={professional?.name || "Profile"}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              }
            />

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto hide-scrollbar pb-20 md:pb-0">
              <div className="p-4 max-w-7xl mx-auto sm:p-6">{renderMiddleContent()}</div>
            </div>
          </div>
        </div>

        {/* Image Upload Modals */}
        {/* Banner Image Upload Modal - Using BannerCropper for professional banner */}
        <BannerCropper
          type="professional"
          open={showBannerModal}
          onOpenChange={setShowBannerModal}
          currentBanner={professional?.banner}
          onUpload={(url) => {
            setBannerUrl(url);
            // Also update the professional object to reflect the change immediately
            if (professional) {
              setProfessional({ ...professional, banner: url });
            }
            toast({
              title: "Success",
              description: "Banner image updated successfully!",
            });
          }}
        />

        {/* Profile Picture Upload Modal */}
        <Dialog
          open={showProfilePictureModal}
          onOpenChange={setShowProfilePictureModal}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Profile Picture</DialogTitle>
              <DialogDescription>
                Upload and crop your profile picture. Recommended dimensions:
                400x400px (square)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <ImageUpload
                accept="image/*"
                aspectRatio={1}
                uploadUrl="/api/professionals/upload"
                uploadType="profile"
                onUpload={(url) => {
                  setProfilePictureUrl(url);
                  setShowProfilePictureModal(false);
                  toast({
                    title: "Success",
                    description: "Profile picture updated successfully!",
                  });
                }}
                onError={(error) =>
                  toast({
                    title: "Upload Error",
                    description: error,
                    variant: "destructive",
                  })
                }
              />

              {professional?.profilePicture && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Current Profile Picture
                  </h4>
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={
                          professional.profilePicture &&
                          isValidImageUrl(professional.profilePicture)
                            ? getOptimizedImageUrl(
                                professional.profilePicture,
                                {
                                  width: 128,
                                  height: 128,
                                  quality: 85,
                                  format: "auto",
                                  crop: "fill",
                                  gravity: "center",
                                },
                              )
                            : professional.profilePicture
                        }
                        alt="Current profile picture"
                        className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowProfilePictureModal(false)}
                  className={`flex-1 ${themeSettings.borderRadius}`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

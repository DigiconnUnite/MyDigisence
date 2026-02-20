"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

// Define Professional type since Prisma doesn't export it for MongoDB
interface Professional {
  id: string;
  name: string;
  slug: string;
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
  createdAt: Date;
  updatedAt: Date;
  adminId: string;
  workExperience: any;
  education: any;
  certifications?: any; // Optional field
  skills: any;
  servicesOffered: any;
  contactInfo: any;
  portfolio: any;
  contactDetails: any;
  ctaButton: any;
}

import { Button } from "@/components/ui/button";
import { useOptimizedImage } from "@/lib/image-optimization";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { saveAs } from 'file-saver';
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Send,
  X,
  MessageCircle,
  User,
  Building2,
  Globe,
  Award,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Home,
  Users,
  Image as ImageIcon,
  Download,
  FileText,
  Share2,
  Menu,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  SiFacebook,
  SiX,
  SiInstagram,
  SiLinkedin,
  SiWhatsapp,
} from "react-icons/si";

interface ProfessionalProfileProps {
  professional: Professional & {
    admin: { name?: string | null; email: string };
  };
}

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ProfessionalProfile({
  professional: initialProfessional,
}: ProfessionalProfileProps) {
  const searchParams = useSearchParams();
  const {
    themeSettings,
    getBackgroundClass,
    getCardClass,
    getButtonClass,
    getPrimaryColor,
    getBorderRadius,
  } = useTheme();
  const [professional, setProfessional] = useState(initialProfessional);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [workExperienceModal, setWorkExperienceModal] = useState(false);
  const [inquiryData, setInquiryData] = useState<InquiryFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [currentView, setCurrentView] = useState<
    "home" | "about" | "services" | "portfolio" | "contact"
  >("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Added for mobile menu toggle
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile viewport detection

  // Ensure skills and servicesOffered are arrays
  const skills = Array.isArray(professional.skills) ? professional.skills : [];
  console.log('Skills array:', skills);
  const servicesOffered = Array.isArray(professional.servicesOffered) ? professional.servicesOffered : [];
  console.log('Services array:', servicesOffered);
  const portfolio = Array.isArray(professional.portfolio) ? professional.portfolio : [];
  const workExperience = Array.isArray(professional.workExperience) ? professional.workExperience : [];
  const validWorkExperience = workExperience.filter(exp => exp && typeof exp === 'object');
  console.log('workExperience:', workExperience);
  console.log('validWorkExperience:', validWorkExperience);
  const education = Array.isArray(professional.education) ? professional.education : [];
  const certifications = Array.isArray(professional.certifications) ? professional.certifications : [];

  const calculateTotalTime = (duration: any) => {
    console.log('calculateTotalTime called with:', duration, typeof duration);
    if (!duration || typeof duration !== 'string') {
      console.log('Returning N/A for duration:', duration);
      return "N/A";
    }
    const match = duration.match(/(\d{4})\s*-\s*(\d{4})/);
    console.log('Match result:', match);
    if (match) {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      const years = end - start;
      return `${years} year${years !== 1 ? "s" : ""}`;
    }
    return duration;
  };

  // Refs for smooth scrolling
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Basic Information Card - Left Column
  const BasicInfoCard = () => {
    const bannerImage = useOptimizedImage(professional.banner, 400, 200);
    const profileImage = useOptimizedImage(
      professional.profilePicture,
      128,
      128
    );

    return (
      <Card
        className={` rounded-2xl py-0 shadow-none border  overflow-hidden h-full`}
      >
        {/* Banner */}
        <div className="relative h-32 bg-linear-to-r from-sky-200 to-sky-300 overflow-hidden">
          {professional.banner && (
            <img
              src={bannerImage.src}
              srcSet={bannerImage.srcSet}
              sizes={bannerImage.sizes}
              alt="Banner"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Profile Image */}
        <div className="relative -mt-12 flex justify-center">
          {professional.profilePicture ? (
            <img
              src={profileImage.src}
              srcSet={profileImage.srcSet}
              sizes={profileImage.sizes}
              alt={professional.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-none "
              loading="lazy"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-none  flex items-center justify-center">
              <User className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>

        <CardContent className="text-center px-4 pb-4">
          {/* Name */}
          <h1 className="text-xl font-bold text-slate-800 mt-2">
            {professional.name}
          </h1>
          
          {/* Headline */}
          {professional.professionalHeadline && (
            <p className="text-gray-600 text-sm mt-1">
              {professional.professionalHeadline}
            </p>
          )}

          {/* Contact Information */}
          <div className="mt-4 space-y-2 text-left">
            {professional.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-sky-600" />
                <span>{professional.location}</span>
              </div>
            )}
            {professional.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-sky-600" />
                <span>{professional.phone}</span>
              </div>
            )}
            {professional.email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-sky-600" />
                <span>{professional.email}</span>
              </div>
            )}
            {professional.website && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-sky-600" />
                <a href={professional.website} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                  {professional.website}
                </a>
              </div>
            )}
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-3 mt-4">
            {professional.facebook && (
              <a
                href={professional.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
              >
                <SiFacebook className="w-5 h-5 text-blue-600" />
              </a>
            )}
            {professional.twitter && (
              <a
                href={professional.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
              >
                <SiX className="w-5 h-5 text-black" />
              </a>
            )}
            {professional.instagram && (
              <a
                href={professional.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
              >
                <SiInstagram className="w-5 h-5 text-pink-600" />
              </a>
            )}
            {professional.linkedin && (
              <a
                href={professional.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
              >
                <SiLinkedin className="w-5 h-5 text-blue-700" />
              </a>
            )}
            {professional.phone && (
              <a
                href={`https://wa.me/${professional.phone!.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 bg-linear-to-b from-green-100 to-white ${getBorderRadius()} hover:from-green-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
              >
                <SiWhatsapp className="w-5 h-5 text-green-600" />
              </a>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {professional.resume ? (
              <Button
                onClick={handleResumeDownload}
                className={`flex items-center justify-center gap-2 text-sm bg-sky-100 hover:bg-sky-200 text-sky-700 ${getBorderRadius()} transition-colors`}
              >
                <FileText className="w-4 h-4" />
                Resume
              </Button>
            ) : (
              <Button
                className={`flex items-center justify-center gap-2 text-sm bg-gray-100 text-gray-400 ${getBorderRadius()} cursor-not-allowed`}
                disabled
              >
                <FileText className="w-4 h-4" />
                No Resume
              </Button>
            )}
            <Button
              onClick={handleDownloadCard}
              className={`flex items-center justify-center gap-2 text-sm bg-sky-100 hover:bg-sky-200 text-sky-700 ${getBorderRadius()} transition-colors`}
            >
              <Download className="w-4 h-4" />
              Card
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Personal Details Card - Right Column
  const PersonalDetailsCard = () => {
    return (
      <Card
        className={`${getCardClass()} rounded-2xl shadow-none border  h-full`}
      >
        <CardContent className="p-0">
          {/* About Section */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-sky-600" />
              About Me
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {professional.aboutMe || "No about information available."}
            </p>
          </div>

          {/* Personal Details Section */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-sky-600" />
              Personal Details
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-900 font-medium">{professional.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900 font-medium">{professional.email || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-900 font-medium">{professional.phone || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900 font-medium">{professional.location || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Website:</span>
                <span className="text-gray-900 font-medium">{professional.website || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="p-4">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-sky-600" />
              Resume
            </h2>
            {professional.resume ? (
              <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Resume Available</p>
                    <p className="text-xs text-gray-500">Click to download</p>
                  </div>
                </div>
                <Button
                  onClick={handleResumeDownload}
                  size="sm"
                  className={`${getButtonClass()}`}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No resume uploaded</p>
                  <p className="text-xs text-gray-400">Upload your resume to share with clients</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleResumeDownload = async () => {
    if (!professional.resume) {
      alert('No resume available for download.');
      return;
    }

    try {
      // Create a temporary link element for downloading
      const link = document.createElement('a');
      link.href = professional.resume;
      link.download = `${professional.name}_Resume`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      // Check if it's a direct download link or needs to be opened in browser
      const fileExtension = professional.resume.split('.').pop()?.toLowerCase();

      if (fileExtension === 'pdf' || fileExtension === 'doc' || fileExtension === 'docx') {
        // For document files, try to download directly
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // For other file types or URLs, open in new tab
        window.open(professional.resume, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again or contact the professional directly.');
    }
  };

  const handleDownloadCard = async () => {
    try {
      // Create professional data object
      const professionalData = {
        name: professional.name,
        professionalHeadline: professional.professionalHeadline,
        location: professional.location,
        phone: professional.phone,
        email: professional.email,
        website: professional.website,
        facebook: professional.facebook,
        twitter: professional.twitter,
        instagram: professional.instagram,
        linkedin: professional.linkedin,
      };

      // Call the API to generate the visiting card
      const response = await fetch('/api/professionals/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ professional: professionalData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate visiting card');
      }

      // Get the PNG buffer from the response
      const cardBuffer = await response.arrayBuffer();
      
      // Create a blob and download
      const blob = new Blob([cardBuffer], { type: 'image/png' });
      const fileName = `${professional.name.replace(/\s+/g, '_')}_Visiting_Card.png`;
      
      // Use file-saver to download
      saveAs(blob, fileName);
      
      toast.success('Visiting card downloaded successfully!');
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Failed to download visiting card. Please try again.');
    }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const errors: string[] = [];

      if (!inquiryData.name.trim()) {
        errors.push("Name is required");
      } else if (inquiryData.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
      } else if (inquiryData.name.trim().length > 100) {
        errors.push("Name must be less than 100 characters");
      }

      if (!inquiryData.email.trim()) {
        errors.push("Email is required");
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(inquiryData.email.trim())) {
          errors.push("Please enter a valid email address");
        }
      }

      if (inquiryData.phone.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(inquiryData.phone.replace(/[\s\-\(\)]/g, ""))) {
          errors.push("Please enter a valid phone number");
        }
      }

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
          businessId: null,
          userId: null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Inquiry submitted successfully! We will get back to you soon.");
        setInquiryModal(false);
        setInquiryData({ name: "", email: "", phone: "", message: "" });
      } else {
        alert(
          `Failed to submit inquiry: ${result.error || "Please try again."}`
        );
      }
    } catch (error) {
      console.error("Inquiry submission error:", error);
      alert(
        "An error occurred while submitting your inquiry. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement | null>,
    sectionName: string
  ) => {
    setActiveSection(sectionName);
    if (ref.current) {
      const offset = 80;
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Intersection Observer - Disabled for static bottom navigation
  // The activeSection is only set by handleViewChange on button click
  useEffect(() => {
    // Observer is set up but not updating activeSection to keep navigation static
    const observer = new IntersectionObserver(
      () => {}, // Empty callback - does nothing
      { threshold: 0.5 }
    );

    const sections = [
      aboutRef.current,
      servicesRef.current,
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
  }, [currentView]);

  useEffect(() => {
    if (currentView !== "home") {
      setActiveSection(currentView);
    }
  }, [currentView]);

  // No artificial delay - data is already loaded via SSR
  // useEffect(() => {
  //   setIsLoading(false);
  // }, []);

  // Mobile viewport detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Define navigation links for professional profile
  const navLinks = [
    {
      value: "home",
      mobileTitle: "Home",
      mobileIcon: Home,
    },
    {
      value: "about",
      mobileTitle: "About",
      mobileIcon: User,
    },
    {
      value: "services",
      mobileTitle: "Services",
      mobileIcon: Users,
    },
    {
      value: "portfolio",
      mobileTitle: "Portfolio",
      mobileIcon: ImageIcon,
    },
    {
      value: "contact",
      mobileTitle: "Contact",
      mobileIcon: MessageCircle,
    },
  ];

  // Handle view change from mobile navigation
  const handleViewChange = (view: string) => {
    setActiveSection(view);
    setCurrentView(view as any);
    if (view === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const ProfileHeaderCard = () => {
    const bannerImage = useOptimizedImage(professional.banner, 400, 200);
    const profileImage = useOptimizedImage(
      professional.profilePicture,
      128,
      128
    );

    return (
      <Card
        className={` p-0 pb-3 rounded-2xl shadow-none border  overflow-hidden`}
      >
        {/* Banner */}
        <div className="relative h-32 bg-linear-to-r from-sky-200 to-sky-300 overflow-hidden">
          {professional.banner && (
            <img
              src={bannerImage.src}
              srcSet={bannerImage.srcSet}
              sizes={bannerImage.sizes}
              alt="Banner"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Profile Image */}
        <div className="relative -mt-12 flex justify-center">
          {professional.profilePicture ? (
            <img
              src={profileImage.src}
              srcSet={profileImage.srcSet}
              sizes={profileImage.sizes}
              alt={professional.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-none "
              loading="lazy"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-none  flex items-center justify-center">
              <User className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>

        <CardContent className="text-center px-4 pb-4">
          {/* Name */}
          <h1 className="text-xl font-bold text-slate-800 mt-2">
            {professional.name}
          </h1>
          
          {/* Headline */}
          {professional.professionalHeadline && (
            <p className="text-gray-600 text-sm mt-1">
              {professional.professionalHeadline}
            </p>
          )}

          {/* Location */}
          {professional.location && (
            <div className="flex items-center justify-center text-sm text-gray-600 mt-2">
              <MapPin className="w-4 h-4 mr-1 text-sky-600" />
              <span>{professional.location}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const CTAActions = () => {
    return (
      <div className="space-y-3">
        {/* Primary CTA Buttons - Same Row */}
        <div className="grid grid-cols-3 gap-2">
          {professional.phone && (
            <Button
              onClick={() =>
                window.open(`tel:${professional.phone}`, "_self")
              }
              className={`flex flex-row items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-none ${getBorderRadius()} py-2 px-2 text-xs`}
            >
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </Button>
          )}
          {professional.phone && (
            <Button
              onClick={() =>
                window.open(
                  `https://wa.me/${professional.phone!.replace(/\D/g, "")}`,
                  "_blank"
                )
              }
              className={`flex flex-row items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white shadow-none ${getBorderRadius()} py-2 px-2 text-xs`}
            >
              <FaWhatsapp className="w-4 h-4" />
              <span>WhatsApp</span>
            </Button>
          )}
          {professional.email && (
            <Button
              onClick={() =>
                window.open(`mailto:${professional.email}`, "_self")
              }
              className={`flex flex-row items-center justify-center gap-2  bg-amber-500 hover:bg-orange-600 text-white shadow-none ${getBorderRadius()} py-2 px-2 text-xs`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Button>
          )}
        </div>

        {/* Secondary Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {professional.resume ? (
            <Button
              onClick={handleResumeDownload}
              className={`flex items-center justify-center gap-2 bg-white hover:bg-sky-100 text-gray-700 border border-gray-200 shadow-none ${getBorderRadius()} py-2`}
            >
              <FileText className="w-4 h-4" />
              Resume
            </Button>
          ) : (
            <Button
              className={`flex items-center justify-center gap-2 bg-gray-100 text-gray-400 ${getBorderRadius()} py-2 cursor-not-allowed`}
              disabled
            >
              <FileText className="w-4 h-4" />
              No Resume
            </Button>
          )}
          <Button
            onClick={handleDownloadCard}
            className={`flex items-center justify-center gap-2 bg-white hover:bg-sky-100 text-gray-700 border border-gray-200 shadow-none ${getBorderRadius()} py-2`}
          >
            <Download className="w-4 h-4" />
            Card
          </Button>
        </div>

        {/* Share Button */}
        <Button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${professional.name} - Professional Profile`,
                text: `Check out ${professional.name}'s professional profile`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href).then(() => {
                toast.success("Profile link copied to clipboard!");
              });
            }
          }}
          className={`w-full flex items-center justify-center gap-2 bg-white hover:bg-sky-100 text-gray-700 border border-gray-200 shadow-none ${getBorderRadius()} py-2`}
        >
          <Share2 className="w-4 h-4" />
          Share Profile
        </Button>
      </div>
    );
  };

  const SocialLinks = () => {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {professional.facebook && (
          <a
            href={professional.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
          >
            <SiFacebook className="w-5 h-5 text-blue-600" />
          </a>
        )}
        {professional.twitter && (
          <a
            href={professional.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
          >
            <SiX className="w-5 h-5 text-black" />
          </a>
        )}
        {professional.instagram && (
          <a
            href={professional.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
          >
            <SiInstagram className="w-5 h-5 text-pink-600" />
          </a>
        )}
        {professional.linkedin && (
          <a
            href={professional.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-linear-to-b from-sky-100 to-white ${getBorderRadius()} hover:from-sky-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
          >
            <SiLinkedin className="w-5 h-5 text-blue-700" />
          </a>
        )}
        {professional.phone && (
          <a
            href={`https://wa.me/${professional.phone!.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 bg-linear-to-b from-green-100 to-white ${getBorderRadius()} hover:from-green-200 hover:to-gray-50 border shadow-none flex items-center justify-center transition-colors`}
          >
            <SiWhatsapp className="w-5 h-5 text-green-600" />
          </a>
        )}
      </div>
    );
  };

 const AddressCard = () => {
  return (
    <Card className="rounded-2xl shadow-md bg-slate-900 hover:shadow-md transition-shadow duration-300 px-3 py-3 flex flex-col items-stretch h-full w-full relative">
      <div className="flex flex-col gap-3 w-full items-center justify-between relative z-10">
        <div className="flex flex-col flex-1 min-w-0 space-y-2.5 w-full">
          
          {/* Location */}
          {professional.location && (
            <div className="flex items-start gap-2.5 group">
              <span className="inline-flex items-center justify-center rounded-full border bg-white/15 border-orange-300/50 group-hover:border-orange-400 transition-colors w-7 h-7 mt-0.5 shrink-0">
                <MapPin className="h-3.5 w-3.5 text-gray-100 group-hover:text-orange-300 transition-colors" />
              </span>
              <span className="text-xs text-white hover:text-orange-300 font-semibold leading-snug break-words">
                {professional.location}
              </span>
            </div>
          )}

          {/* Phone */}
          {professional.phone && (
            <div className="flex items-center gap-2.5 group">
              <span className="inline-flex items-center justify-center rounded-full border bg-white/15 border-orange-300/50 group-hover:border-orange-400 transition-colors w-7 h-7 shrink-0">
                <Phone className="h-3.5 w-3.5 text-gray-100 group-hover:text-orange-300 transition-colors shrink-0" />
              </span>
              <a
                href={`tel:${professional.phone}`}
                className="text-xs text-white hover:text-orange-300 hover:underline font-semibold break-all"
                title="Call this number"
              >
                {professional.phone}
              </a>
            </div>
          )}

          {/* Email */}
          {professional.email && (
            <div className="flex items-center gap-2.5 group">
              <span className="inline-flex items-center justify-center rounded-full border bg-white/15 border-orange-300/50 group-hover:border-orange-400 transition-colors w-7 h-7 shrink-0">
                <Mail className="h-3.5 w-3.5 text-gray-100 group-hover:text-orange-300 transition-colors shrink-0" />
              </span>
              <a
                href={`mailto:${professional.email}`}
                className="text-xs text-white hover:text-orange-300 hover:underline font-semibold break-all"
                title="Send email"
              >
                {professional.email}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Social Links & Website */}
      {(professional.facebook ||
        professional.twitter ||
        professional.instagram ||
        professional.linkedin ||
        professional.website ||
        professional.phone) && (
        <div className="w-full border-t pt-4 border-gray-200/80 mt-1 relative z-10">
          <div className="flex flex-wrap gap-2 w-full justify-center items-center">
            
            {/* Website */}
            {professional.website && (
              <a
                href={
                  professional.website.startsWith("http")
                    ? professional.website
                    : `https://${professional.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
                aria-label="Website"
              >
                <Globe className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
              </a>
            )}

            {/* Facebook */}
            {professional.facebook && (
              <a
                href={
                  professional.facebook.startsWith("http")
                    ? professional.facebook
                    : `https://${professional.facebook}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors group"
                aria-label="Facebook"
              >
                <SiFacebook className="h-4 w-4 text-blue-600 group-hover:text-blue-800" />
              </a>
            )}

            {/* Twitter */}
            {professional.twitter && (
              <a
                href={
                  professional.twitter.startsWith("http")
                    ? professional.twitter
                    : `https://${professional.twitter}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
                aria-label="Twitter"
              >
                <SiX className="h-4 w-4 text-gray-600 group-hover:text-gray-800" />
              </a>
            )}

            {/* Instagram */}
            {professional.instagram && (
              <a
                href={
                  professional.instagram.startsWith("http")
                    ? professional.instagram
                    : `https://${professional.instagram}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors group"
                aria-label="Instagram"
              >
                <SiInstagram className="h-4 w-4 text-pink-600 group-hover:text-pink-800" />
              </a>
            )}

            {/* LinkedIn */}
            {professional.linkedin && (
              <a
                href={
                  professional.linkedin.startsWith("http")
                    ? professional.linkedin
                    : `https://${professional.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors group"
                aria-label="LinkedIn"
              >
                <SiLinkedin className="h-4 w-4 text-blue-600 group-hover:text-blue-800" />
              </a>
            )}

            {/* WhatsApp (Styled to match the theme) */}
            {professional.phone && (
              <a
                href={`https://wa.me/${professional.phone!.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 transition-colors group"
                aria-label="WhatsApp"
              >
                <SiWhatsapp className="h-4 w-4 text-green-600 group-hover:text-green-800" />
              </a>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

const Preloader = () => (
  <div className="fixed inset-0 bg-white z-99999 flex flex-col items-center h-screen w-full">
    {/* Middle Section: Profile Picture and Loading Text */}
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      {/* Spinning Profile Photo */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full border  flex items-center justify-center shadow-sm bg-slate-50">
          {professional.profilePicture &&
          professional.profilePicture.trim() !== "" ? (
            <img
              src={professional.profilePicture}
              alt={professional.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-sky-400" />
          )}
        </div>
      </div>
    </div>

    {/* Bottom Section: Digisence Logo and Name */}
    <div className="mb-10 flex flex-row items-center">
      {/* Digisence Logo */}
      <img
        src="/logo.png"
        alt="Digisence Logo"
        className="w-8 h-8 mb-2 object-contain"
      />

      {/* Digisence Name */}
      <h1 className="text-2xl font-bold text-slate-800 tracking-tight ml-2">
        Digisence
      </h1>
    </div>
  </div>
);
  return (
    <>
      {/* Preloader */}
      {isLoading && <Preloader />}
      
      <div
        className={`h-screen w-full overflow-hidden bg-orange-50 flex flex-col ${isLoading ? 'pointer-events-none opacity-0' : ''}`}
        suppressHydrationWarning
      >
      {/* PAGE HEADER - Desktop Only */}
      <header className="hidden md:flex shrink-0 bg-white shadow-none border-b z-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Business Name */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                {professional.profilePicture &&
                professional.profilePicture.trim() !== "" ? (
                  <img
                    src={professional.profilePicture}
                    alt={professional.name}
                    className="h-10 w-10 border rounded-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              <span className="text-lg font-bold text-gray-900 hidden md:block">
                {professional.name}
              </span>
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex space-x-2">
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    currentView === "home"
                      ? "text-sky-600 bg-sky-50 border border-sky-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() => {
                    setCurrentView("home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <Home
                    className={`w-4 h-4 mr-2 transition-colors ${
                      currentView === "home" ? "text-sky-600" : "text-gray-500"
                    }`}
                  />
                  Home
                </button>
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    currentView === "about"
                      ? "text-sky-600 bg-sky-50 border border-sky-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() => setCurrentView("about")}
                >
                  <User
                    className={`w-4 h-4 mr-2 transition-colors ${
                      currentView === "about" ? "text-sky-600" : "text-gray-500"
                    }`}
                  />
                  About
                </button>
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    currentView === "services"
                      ? "text-sky-600 bg-sky-50 border border-sky-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() => setCurrentView("services")}
                >
                  <Users
                    className={`w-4 h-4 mr-2 transition-colors ${
                      currentView === "services"
                        ? "text-sky-600"
                        : "text-gray-500"
                    }`}
                  />
                  Services
                </button>
                <button
                  className={`flex items-center text-sm font-medium transition-all duration-200 ${
                    currentView === "portfolio"
                      ? "text-sky-600 bg-sky-50 border border-sky-200"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  } px-3 py-2 rounded-lg`}
                  onClick={() => setCurrentView("portfolio")}
                >
                  <ImageIcon
                    className={`w-4 h-4 mr-2 transition-colors ${
                      currentView === "portfolio"
                        ? "text-sky-600"
                        : "text-gray-500"
                    }`}
                  />
                  Portfolio
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu />
              </Button>
            </div>

            {/* Right Side Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                onClick={() => setCurrentView("contact")}
                className={`bg-sky-600 hover:bg-sky-700 text-white ${getBorderRadius()} px-4 py-2 shadow-md`}
              >
                Let's Talk
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Optional, based on BP) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  currentView === "home" ? "text-sky-600" : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  setCurrentView("home");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setMobileMenuOpen(false);
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  currentView === "about" ? "text-sky-600" : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  setCurrentView("about");
                  setMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4 mr-2" />
                About
              </button>
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  currentView === "services" ? "text-sky-600" : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  setCurrentView("services");
                  setMobileMenuOpen(false);
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Services
              </button>
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  currentView === "portfolio" ? "text-sky-600" : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  setCurrentView("portfolio");
                  setMobileMenuOpen(false);
                }}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Portfolio
              </button>
              <button
                className={`w-full flex items-center text-sm font-medium ${
                  currentView === "contact" ? "text-sky-600" : "text-gray-600"
                } px-3 py-2 rounded-lg hover:bg-gray-50`}
                onClick={() => {
                  setCurrentView("contact");
                  setMobileMenuOpen(false);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation */}
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
                      ? "text-orange-400 font-extrabold border-t-4 border-orange-400"
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

      {/* Main Content Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-hidden">
        {/* ASIDE - Sticky Sidebar (Desktop Only) */}
        <aside className="hidden md:block md:col-span-1 h-full overflow-y-auto z-20">
          <div className="flex flex-col p-4 lg:gap-4 w-full">
            {/* Sticky Wrapper */}
            <div className="sticky top-24 space-y-4">
              {/* Profile Header Card - Banner, Name, Headline only */}
              <ProfileHeaderCard />

              {/* CTA Buttons - Without Card */}
              <CTAActions />

              {/* Address Card - With Social Icons Inside */}
              <AddressCard />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="md:col-span-3 h-full overflow-y-auto relative scroll-smooth min-w-0">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-4 space-y-6 lg:space-y-8">
            {currentView === "about" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-3">
                  <Card
                    className={`${getCardClass()} rounded-2xl p-6 shadow-none border  h-full`}
                  >
                    <CardContent className="p-0">
                      <div className="space-y-6">
                        {/* About Me Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                            <User className="w-5 h-5 mr-2 text-sky-600" />
                            About Me
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {professional.aboutMe ||
                              "No about information available."}
                          </p>
                        </div>

                        {/* Education Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-sky-600" />
                            Education
                          </h3>
                          {professional.education &&
                          professional.education.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {professional.education.map(
                                (edu: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                                      <Award className="w-5 h-5 text-sky-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">
                                        {edu.degree || edu.title}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {edu.institution || edu.school}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {edu.year || edu.duration}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              No education information available.
                            </p>
                          )}
                        </div>

                        {/* Certifications Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                            <Award className="w-5 h-5 mr-2 text-sky-600" />
                            Certifications
                          </h3>
                          {professional.certifications &&
                          professional.certifications.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {professional.certifications.map(
                                (cert: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                                      <Award className="w-5 h-5 text-sky-600" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">
                                        {cert.name || cert.title}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {cert.issuer || cert.organization}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {cert.year || cert.date}
                                      </p>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">
                              No certifications available.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          <Award className="w-5 h-5 mr-2 text-sky-600" />
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {skills.map((skill: any, index: number) => (
                            <div
                              key={index}
                              className={`flex items-center bg-white ${getBorderRadius()} px-4 py-2 border border-gray-200 shadow-none`}
                            >
                              <Award className="w-4 h-4 text-sky-600 mr-2" />
                              <span className="text-sm text-gray-700">
                                {skill.name?.name || skill.name}
                              </span>
                            </div>
                          ))}
                          {skills.length === 0 && (
                            <p className="text-gray-500 italic">
                              No skills information available.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : currentView === "services" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-3">
                  <Card
                    className={`${getCardClass()} p-6 rounded-2xl shadow-none border `}
                  >
                    <CardContent className="p-0">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">
                          Services
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {servicesOffered
                          .slice(0, 10)
                          .map((service: any, index: number) => (
                            <div
                              key={index}
                              className={`flex flex-col items-center p-4 bg-gray-50 ${getBorderRadius()} hover:bg-gray-100 transition-colors`}
                            >
                              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-3">
                                <Award className="w-6 h-6 text-sky-600" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900 text-center">
                                {service.name?.name || service.name}
                              </span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : currentView === "portfolio" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-3">
                  <Card
                    className={`${getCardClass()} rounded-2xl p-6 shadow-none border h-full`}
                  >
                    <CardContent className="p-0">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-slate-800">
                          Portfolio
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolio.map((item: any, index: number) => {
                          const isVideo =
                            item.type === "video" ||
                            (item.url &&
                              (item.url.includes(".mp4") ||
                                item.url.includes(".webm") ||
                                item.url.includes(".ogg")));
                          return (
                            <div
                              key={index}
                              className="flex flex-col h-full bg-white shadow-md w-full rounded-xl overflow-hidden border border-gray-200  hover:shadow-md transition-shadow"
                            > 
                              {/* Image Container - Full Width */}
                              <div className="relative w-full aspect-video bg-gray-100">
                                {isVideo ? (
                                  <video
                                    src={item.url}
                                    controls
                                    className="w-full h-full object-cover"
                                    poster={item.thumbnail || undefined}
                                  >
                                    Your browser does not support video tag.
                                  </video>
                                ) : (
                                  <OptimizedImage
                                    src={item.url}
                                    alt={item.title || "Portfolio image"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                )}
                              </div>
                              {/* Content - Full Width */}
                              <div className="p-4 flex flex-col flex-1">
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {portfolio.length === 0 && (
                          <p className="text-gray-500 italic text-center py-8 col-span-3">
                            No portfolio items available.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : currentView === "contact" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-3">
                  <Card
                    className={`${getCardClass()} p-6 rounded-2xl shadow-none border`}
                  >
                    <CardContent className="p-0">
                      <h2 className="text-xl font-bold text-slate-800 mb-4">
                        Let's Talk
                      </h2>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        Ready to start a project or have questions? Get in touch
                        with me today. I'm always open to discussing new
                        opportunities and creative ideas.
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setInquiryModal(true);
                        }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="contact-name">Name *</Label>
                            <Input
                              id="contact-name"
                              value={inquiryData.name}
                              onChange={(e) =>
                                setInquiryData((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              required
                              placeholder="Your full name"
                              className={getBorderRadius()}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact-email">Email *</Label>
                            <Input
                              id="contact-email"
                              type="email"
                              value={inquiryData.email}
                              onChange={(e) =>
                                setInquiryData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              required
                              placeholder="your.email@example.com"
                              className={getBorderRadius()}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone</Label>
                          <Input
                            id="contact-phone"
                            type="tel"
                            value={inquiryData.phone}
                            onChange={(e) =>
                              setInquiryData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            placeholder="+91 (555) 123-4567"
                            className={getBorderRadius()}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-message">Message *</Label>
                          <Textarea
                            id="contact-message"
                            value={inquiryData.message}
                            onChange={(e) =>
                              setInquiryData((prev) => ({
                                ...prev,
                                message: e.target.value,
                              }))
                            }
                            rows={5}
                            required
                            placeholder="Tell me about your project or ask your question..."
                            className={getBorderRadius()}
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 ${getButtonClass()}`}
                          >
                            {isSubmitting ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile View: Profile Card - Show after banner/hero */}
                <div className="md:hidden mb-6">
                  <ProfileHeaderCard />
                  <div className="mt-4">
                    <CTAActions />
                  </div>
                  <div className="mt-4">
                    <AddressCard />
                  </div>
                </div>

                {/* Top Section: 2 Columns */}
                <div
                  ref={aboutRef}
                  id="about"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 h-full"
                >
                  {/* Left Column: Work Experience + Expert Area */}
                  <div className="space-y-6 h-full flex flex-col">
                    {/* Work Experience Card */}
                    <Card
                      className={`${getCardClass()} rounded-2xl p-6 shadow-none border  h-full flex flex-col`}
                    >
                      <CardContent className="p-0 overflow-hidden h-full flex flex-col">
                        <div className="flex justify-between items-center mb-5">
                          <h2 className="text-lg font-bold text-slate-800">
                            Work Experience
                          </h2>
                          <button
                            onClick={() => setWorkExperienceModal(true)}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
                          >
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                        <div className="overflow-hidden flex-1">
                          <div
                            className={`flex flex-col space-y-4 ${
                              workExperience.length > 3 ? "animate-marquee" : ""
                            }`}
                          >
                            {console.log("workExperience:", workExperience)}
                            {validWorkExperience.map(
                              (exp: any, index: number) => {
                                return (
                                  <div
                                    key={`exp-${index}`}
                                    className="flex items-start space-x-4 rounded-lg"
                                  >
                                    <div className="w-15 h-15 bg-linear-to-b from-sky-50 to-white rounded-lg flex items-center justify-center shrink-0 border border-gray-700/10">
                                      <Building2 className="w-5 h-5 text-sky-600" />
                                    </div>
                                    <div className="flex-1 flex justify-items-end gap-1 w-full">
                                      <div className="grid grid-cols-1 gap-1">
                                        <p className="text-gray-900 font-medium text-sm">
                                          {exp.company}
                                        </p>
                                        <p className="text-gray-700 text-xs">
                                          {exp.position}
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                          {exp.location}
                                        </p>
                                      </div>
                                      <div className="flex items-end flex-col ml-auto justify-between mt-2">
                                        <span className="text-gray-500 text-xs">
                                          {exp.duration}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                          Total:{" "}
                                          {exp.duration
                                            ? calculateTotalTime(exp.duration)
                                            : "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                            {professional.workExperience &&
                              validWorkExperience.length > 3 &&
                              validWorkExperience.map(
                                (exp: any, index: number) => {
                                  return (
                                    <div
                                      key={`exp-dup-${index}`}
                                      className="flex items-start space-x-4 rounded-lg"
                                    >
                                      <div className="w-15 h-15 bg-linear-to-b from-sky-50 to-white rounded-lg flex items-center justify-center border border-gray-700/10 shrink-0 shadow-none">
                                        <Building2 className="w-5 h-5 text-sky-600" />
                                      </div>
                                      <div className="flex-1 flex justify-items-end gap-1 w-full">
                                        <div className="grid grid-cols-1 gap-1">
                                          <p className="text-gray-900 font-medium text-sm">
                                            {exp.company}
                                          </p>
                                          <p className="text-gray-700 text-xs">
                                            {exp.position}
                                          </p>
                                          <p className="text-gray-600 text-xs">
                                            {exp.location}
                                          </p>
                                        </div>
                                        <div className="flex items-end flex-col ml-auto justify-between mt-2">
                                          <span className="text-gray-500 text-xs">
                                            {exp.duration}
                                          </span>
                                          <span className="text-gray-400 text-xs">
                                            Total:{" "}
                                            {exp.duration
                                              ? calculateTotalTime(exp.duration)
                                              : "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Expert Area (Skills) Card */}
                    <Card
                      className={`${getCardClass()} rounded-2xl h-full p-6 shadow-none border `}
                    >
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-5">
                          <h2 className="text-lg font-bold text-slate-800">
                            Expert Area
                          </h2>
                          <button
                            onClick={() => setCurrentView("about")}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
                          >
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-3 overflow-hidden flex-1">
                          {skills
                            .slice(0, 12)
                            .map((skill: any, index: number) => (
                              <div
                                key={index}
                                className={`flex items-center bg-white ${getBorderRadius()} px-4 py-1 border border-gray-200`}
                              >
                                <Award className="w-5 h-5 text-sky-600 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {skill.name?.name || skill.name}
                                </span>
                              </div>
                            ))}
                          {skills.length > 12 && (
                            <div
                              className={`flex items-center bg-white ${getBorderRadius()} px-4 py-2 border border-gray-200`}
                            >
                              <span className="text-sm text-gray-700">...</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column: Portfolio Card */}
                  <div className="space-y-6 h-full flex flex-col">
                    <Card
                      className={`${getCardClass()} rounded-2xl p-6 shadow-none border  h-full flex flex-col`}
                    >
                      <CardContent className="p-0 overflow-hidden h-full flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-lg font-bold text-slate-800">
                            Portfolio
                          </h2>
                          <button
                            onClick={() => setCurrentView("portfolio")}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
                          >
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 h-full">
                          {portfolio
                            .slice(0, 4)
                            .map((item: any, index: number) => {
                              const isVideo =
                                item.type === "video" ||
                                (item.url &&
                                  (item.url.includes(".mp4") ||
                                    item.url.includes(".webm") ||
                                    item.url.includes(".ogg")));
                              return (
                                <div
                                  key={index}
                                  className="flex flex-col rounded-lg overflow-hidden border border-gray-200 shadow-none h-fit"
                                >
                                  <div className="relative w-full aspect-video bg-gray-100">
                                    {isVideo ? (
                                      <video
                                        src={item.url}
                                        controls
                                        className="w-full h-full object-cover"
                                        poster={item.thumbnail || undefined}
                                      >
                                        Your browser does not support video tag.
                                      </video>
                                    ) : (
                                      <OptimizedImage
                                        src={item.url}
                                        alt={item.title || "Portfolio image"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                      />
                                    )}
                                  </div>
                                  <div className="p-3">
                                    <span className="text-sm font-semibold text-gray-900 block">
                                      {item.title}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Bottom Section: 2 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {/* Services Section - Col 1 */}
                  <div
                    ref={servicesRef}
                    id="services"
                    className="md:col-span-1"
                  >
                    <Card
                      className={`${getCardClass()} p-6 rounded-2xl shadow-none border `}
                    >
                      <CardContent className="p-0">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-lg font-bold text-slate-800">
                            Services
                          </h2>
                          <button
                            onClick={() => setCurrentView("services")}
                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
                          >
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {servicesOffered
                            .slice(0, 4)
                            .map((service: any, index: number) => (
                              <div
                                key={index}
                                className={`flex flex-col items-center p-3 bg-gray-50 ${getBorderRadius()} hover:bg-gray-100 transition-colors`}
                              >
                                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center mb-3">
                                  <Award className="w-6 h-6 text-sky-600" />
                                </div>
                                <span className="text-sm font-bold text-gray-900 text-center">
                                  {service.name}
                                </span>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Let's Talk Section - Col 2 */}
                  <div ref={contactRef} id="contact" className="md:col-span-1">
                    <Card
                      className={`${getCardClass()} p-6 rounded-2xl shadow-none border `}
                    >
                      <CardContent className="p-0">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">
                          Let's Talk
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                          Ready to start a project or have questions? Get in
                          touch with me today. I'm always open to discussing new
                          opportunities and creative ideas.
                        </p>
                        <div className="mt-6">
                          <Button
                            onClick={() => setCurrentView("contact")}
                            className={`w-full ${getButtonClass()} shadow-none border`}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `,
        }}
      />

      {/* Inquiry Modal */}
      <Dialog open={inquiryModal} onOpenChange={setInquiryModal}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle>Contact {professional.name}</DialogTitle>
            <DialogDescription>
              Send a message and we'll get back to you soon.
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
                className={getBorderRadius()}
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
                className={getBorderRadius()}
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
                className={getBorderRadius()}
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
                className={getBorderRadius()}
              />
            </div>
            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 ${getButtonClass()}`}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Work Experience Modal */}
      <Dialog open={workExperienceModal} onOpenChange={setWorkExperienceModal}>
        <DialogContent className="max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Work Experience</DialogTitle>
            <DialogDescription>
              Complete work history and professional experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {validWorkExperience.map((exp: any, index: number) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="w-15 h-15 bg-linear-to-b from-sky-50 to-white rounded-lg flex items-center justify-center shrink-0 border border-gray-700/10 shadow-none">
                  <Building2 className="w-5 h-5 text-sky-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">
                        {exp.company}
                      </p>
                      <p className="text-gray-700 text-xs">{exp.position}</p>
                      <p className="text-gray-600 text-xs">{exp.location}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-500 text-xs">
                        {exp.duration}
                      </span>
                      <span className="text-gray-400 text-xs">
                        Total:{" "}
                        {exp.duration
                          ? calculateTotalTime(exp.duration)
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {validWorkExperience.length === 0 && (
              <p className="text-gray-500 italic text-center py-4">
                No work experience information available.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      </div>
      </>
  );
}
import { LucideIcon } from "lucide-react";

export interface Professional {
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
  createdAt: string;
  updatedAt: string;
  adminId: string;
}

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  mobileIcon: LucideIcon;
  value: string;
  mobileTitle: string;
}

// Re-export from config for consistency
export type { ProfessionalView, ProfileTabId, SettingsTabId } from "../config/searchIndex";

export interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "expert" | "master";
}

export interface WorkExperience {
  position: string;
  company: string;
  location?: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  isCurrent: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  description?: string;
}

export interface Service {
  name: string;
  description: string;
  price: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  url: string;
}

export interface SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

export interface HeaderSearchResult {
  id: string;
  label: string;
  description?: string;
  routeLabel?: string;
  view?: string;
  tab?: string;
  sectionId?: string;
  keywords?: string[];
}

export interface Business {
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

export interface Professional {
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  _count: {
    businesses: number;
  };
}

export interface AdminStats {
  totalBusinesses: number;
  totalInquiries: number;
  totalUsers: number;
  activeBusinesses: number;
  totalProducts: number;
  totalActiveProducts: number;
  totalProfessionals: number;
  activeProfessionals: number;
}

export interface BusinessQueryParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface BusinessApiResponse {
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ProfessionalApiResponse {
  professionals: Professional[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

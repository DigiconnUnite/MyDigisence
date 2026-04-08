export type InquiryStatus = "NEW" | "READ" | "REPLIED" | "CLOSED";

export interface HeroSlide {
  mediaType: "image" | "video";
  media: string;
  headline?: string;
  headlineSize?: string;
  headlineColor?: string;
  headlineAlignment?: "left" | "center" | "right";
  subtext?: string;
  subtextSize?: string;
  subtextColor?: string;
  subtextAlignment?: "left" | "center" | "right";
  cta?: string;
  ctaLink?: string;
  showText?: boolean;
}

export interface HeroContent {
  slides: HeroSlide[];
  autoPlay: boolean;
  transitionSpeed: number;
  showDots?: boolean;
  showArrows?: boolean;
  showText?: boolean;
}

export interface BrandItem {
  name: string;
  logo?: string;
}

export interface BrandContent {
  brands: BrandItem[];
  newBrandName?: string;
  newBrandLogo?: string;
}

export interface PortfolioItem {
  url: string;
  alt?: string;
}

export interface PortfolioContent {
  images: PortfolioItem[];
}

export interface FooterContent {
  [key: string]: string | number | boolean | null | undefined;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  image: string | null;
  inStock: boolean;
  isActive: boolean;
  additionalInfo?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
  categoryId: string | null;
  brandName: string | null;
  category?: {
    id: string;
    name: string;
  };
  brand?: {
    id: string;
    name: string;
  };
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
  };
  children?: {
    id: string;
    name: string;
  }[];
  _count?: {
    products: number;
  };
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  address: string | null;
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
  categoryId: string | null;
  heroContent: HeroContent;
  brandContent: BrandContent;
  portfolioContent: PortfolioContent;
  footerContent?: FooterContent;
  additionalContent?: Record<string, unknown>;
  about?: string | null;
  catalogPdf?: string | null;
  openingHours?: { day: string; open: string; close: string }[];
  gstNumber?: string | null;
  admin: {
    id?: string;
    name?: string | null;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  };
  products: Product[];
}

export interface BusinessStats {
  totalProducts: number;
  activeProducts: number;
  totalInquiries: number;
  newInquiries: number;
  readInquiries: number;
  repliedInquiries: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  categoryId: string;
  brandName: string;
  additionalInfo: Record<string, string>;
  inStock: boolean;
  isActive: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
  parentId: string;
}

export interface BusinessInfoFormData {
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
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export interface BusinessResponse {
  business: Business;
}

export interface ProductsResponse {
  products: Product[];
}

export interface InquiriesResponse {
  inquiries: Inquiry[];
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface MutationSuccessResponse<T> {
  success: true;
  message?: string;
  business?: Business;
  product?: Product;
  category?: Category;
  inquiry?: Inquiry;
  data?: T;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  type?: string;
  resourceType?: "video" | "image" | "raw";
  optimizedUrls?: Record<string, string>;
  message?: string;
  error?: string;
}

export interface BusinessDashboardData {
  business: Business | null;
  categories: Category[];
  products: Product[];
  inquiries: Inquiry[];
}

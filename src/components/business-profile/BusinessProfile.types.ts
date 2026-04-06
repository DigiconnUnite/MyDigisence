export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  about: string | null;
  logo: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  catalogPdf: string | null;
  openingHours: any;
  gstNumber: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  adminId: string;
  categoryId: string | null;
  heroContent: any;
  brandContent: any;
  portfolioContent: any;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  image: string | null;
  inStock: boolean;
  isActive: boolean;
  additionalInfo: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
  businessId: string;
  categoryId: string | null;
  brandName: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

export interface BusinessCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  _count?: {
    products: number;
  };
}

export interface BusinessProfileProps {
  business: Business & {
    admin: { name?: string | null; email: string };
    category?: { name: string } | null;
    portfolioContent?: any;
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
    linkedin?: string | null;
    about?: string | null;
    catalogPdf?: string | null;
    openingHours?: any[];
    gstNumber?: string | null;
    products: (Product & {
      category?: { id: string; name: string } | null;
    })[];
  };
  categories?: BusinessCategory[];
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  productId?: string;
}

export interface SelectCategoryOption {
  id: string;
  name: string;
}

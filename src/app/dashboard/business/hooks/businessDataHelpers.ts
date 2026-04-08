import type {
  BusinessDashboardData,
  BusinessStats,
  Inquiry,
  Product,
} from "../types";

export const BUSINESS_FETCH_ENDPOINTS = {
  business: "/api/business",
  categories: "/api/business/categories",
  products: "/api/business/products",
  inquiries: "/api/business/inquiries",
} as const;

export const buildBusinessStats = (
  products: Product[],
  inquiries: Inquiry[],
): BusinessStats => {
  const newInquiries = inquiries.filter((inquiry) => inquiry.status === "NEW").length;
  const readInquiries = inquiries.filter((inquiry) => inquiry.status === "READ").length;
  const repliedInquiries = inquiries.filter((inquiry) => inquiry.status === "REPLIED").length;

  return {
    totalProducts: products.length,
    activeProducts: products.filter((product) => product.isActive).length,
    totalInquiries: inquiries.length,
    newInquiries,
    readInquiries,
    repliedInquiries,
  };
};

export const getUniqueProductImages = (products: Product[]): string[] => {
  return [...new Set(products.map((product) => product.image).filter(Boolean))] as string[];
};

export const createInitialBusinessDashboardData = (): BusinessDashboardData => ({
  business: null,
  categories: [],
  products: [],
  inquiries: [],
});

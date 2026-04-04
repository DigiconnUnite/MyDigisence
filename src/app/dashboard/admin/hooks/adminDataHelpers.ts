import type { AdminStats, Business, Professional } from "../types";

export const ADMIN_FETCH_ENDPOINTS = [
  { name: "businesses", url: "/api/admin/businesses" },
  { name: "categories", url: "/api/admin/categories" },
  { name: "inquiries", url: "/api/inquiries" },
  { name: "professionals", url: "/api/admin/professionals" },
  { name: "businessListingInquiries", url: "/api/business-listing-inquiries" },
  { name: "registrationInquiries", url: "/api/admin/registration-inquiries" },
] as const;

export const getCollectionFromResponse = <T,>(payload: any, key: string): T[] => {
  if (Array.isArray(payload?.[key])) {
    return payload[key];
  }
  if (Array.isArray(payload)) {
    return payload;
  }
  return [];
};

export const buildAdminStats = (
  businesses: Business[],
  professionals: Professional[],
  registrationInquiries: any[]
): AdminStats => {
  const totalProducts = businesses.reduce(
    (sum: number, business: Business) => sum + (business._count?.products || 0),
    0
  );
  const activeBusinesses = businesses.filter((business: Business) => business.isActive).length;
  const totalActiveProducts = businesses
    .filter((business: Business) => business.isActive)
    .reduce((sum: number, business: Business) => sum + (business._count?.products || 0), 0);
  const activeProfessionals = professionals.filter(
    (professional: Professional) => professional.isActive
  ).length;

  return {
    totalBusinesses: businesses.length,
    totalInquiries: registrationInquiries.length,
    totalUsers: businesses.length,
    activeBusinesses,
    totalProducts,
    totalActiveProducts,
    totalProfessionals: professionals.length,
    activeProfessionals,
  };
};
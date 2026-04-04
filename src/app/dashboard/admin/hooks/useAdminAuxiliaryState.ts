import { useState } from "react";
import type { BusinessQueryParams, Category } from "../types";

const defaultQueryState: BusinessQueryParams = {
  page: 1,
  limit: 10,
  search: "",
  status: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export function useAdminAuxiliaryState() {
  const [inquiryToDelete, setInquiryToDelete] = useState<any>(null);
  const [showDeleteInquiryDialog, setShowDeleteInquiryDialog] = useState(false);
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
  const [inquiryQuery, setInquiryQuery] = useState<BusinessQueryParams>(defaultQueryState);
  const [inquiryPagination, setInquiryPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);

  const [selectedRegistrations, setSelectedRegistrations] = useState<Set<string>>(new Set());
  const [selectedRegistrationInquiry, setSelectedRegistrationInquiry] = useState<any>(null);
  const [showRegistrationInquiryDialog, setShowRegistrationInquiryDialog] = useState(false);
  const [registrationQuery, setRegistrationQuery] = useState<BusinessQueryParams>(defaultQueryState);
  const [registrationPagination, setRegistrationPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [categoryQuery, setCategoryQuery] = useState<BusinessQueryParams>(defaultQueryState);
  const [categoryPagination, setCategoryPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [showDeleteCategoryDialog, setShowDeleteCategoryDialog] = useState(false);

  const [businessListingQuery, setBusinessListingQuery] = useState<BusinessQueryParams>(defaultQueryState);
  const [businessListingPagination, setBusinessListingPagination] = useState<{
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  } | null>(null);
  const [selectedBusinessListings, setSelectedBusinessListings] = useState<Set<string>>(new Set());

  return {
    inquiryToDelete,
    setInquiryToDelete,
    showDeleteInquiryDialog,
    setShowDeleteInquiryDialog,
    selectedInquiries,
    setSelectedInquiries,
    inquiryQuery,
    setInquiryQuery,
    inquiryPagination,
    setInquiryPagination,
    selectedRegistrations,
    setSelectedRegistrations,
    selectedRegistrationInquiry,
    setSelectedRegistrationInquiry,
    showRegistrationInquiryDialog,
    setShowRegistrationInquiryDialog,
    registrationQuery,
    setRegistrationQuery,
    registrationPagination,
    setRegistrationPagination,
    selectedCategories,
    setSelectedCategories,
    categoryQuery,
    setCategoryQuery,
    categoryPagination,
    setCategoryPagination,
    categoryToDelete,
    setCategoryToDelete,
    showDeleteCategoryDialog,
    setShowDeleteCategoryDialog,
    businessListingQuery,
    setBusinessListingQuery,
    businessListingPagination,
    setBusinessListingPagination,
    selectedBusinessListings,
    setSelectedBusinessListings,
  };
}

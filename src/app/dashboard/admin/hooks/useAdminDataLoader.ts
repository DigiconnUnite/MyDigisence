import { useCallback, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type { AdminStats, Business, Category, Professional } from "../types";
import {
  ADMIN_FETCH_ENDPOINTS,
  buildAdminStats,
  getCollectionFromResponse,
} from "./adminDataHelpers";
import { fetchAdminJsonOrNull } from "./adminQuery";

interface UseAdminDataLoaderArgs {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setDataFetchError: Dispatch<SetStateAction<string | null>>;
  setBusinesses: Dispatch<SetStateAction<Business[]>>;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setInquiries: Dispatch<SetStateAction<any[]>>;
  setProfessionals: Dispatch<SetStateAction<Professional[]>>;
  setBusinessListingInquiries: Dispatch<SetStateAction<any[]>>;
  setRegistrationInquiries: Dispatch<SetStateAction<any[]>>;
  setStats: Dispatch<SetStateAction<AdminStats>>;
}

export function useAdminDataLoader({
  setIsLoading,
  setDataFetchError,
  setBusinesses,
  setCategories,
  setInquiries,
  setProfessionals,
  setBusinessListingInquiries,
  setRegistrationInquiries,
  setStats,
}: UseAdminDataLoaderArgs) {
  const adminDataFetchControllerRef = useRef<AbortController | null>(null);
  const adminDataFetchRequestRef = useRef(0);

  const fetchData = useCallback(async () => {
    adminDataFetchControllerRef.current?.abort();
    const controller = new AbortController();
    adminDataFetchControllerRef.current = controller;
    const requestId = ++adminDataFetchRequestRef.current;

    setIsLoading(true);
    setDataFetchError(null);

    try {
      const endpointResponses = await Promise.all(
        ADMIN_FETCH_ENDPOINTS.map((endpoint) => fetchAdminJsonOrNull(endpoint.url, controller.signal))
      );

      const results = ADMIN_FETCH_ENDPOINTS.reduce<Record<string, any>>((acc, endpoint, index) => {
        acc[endpoint.name] = endpointResponses[index];
        return acc;
      }, {});

      const businessesArray = getCollectionFromResponse<Business>(results.businesses, "businesses");
      const categoriesArray = getCollectionFromResponse<Category>(results.categories, "categories");
      const inquiriesArray = getCollectionFromResponse<any>(results.inquiries, "inquiries");
      const professionalsArray = getCollectionFromResponse<Professional>(results.professionals, "professionals");
      const businessListingInquiriesArray = getCollectionFromResponse<any>(
        results.businessListingInquiries,
        "businessListingInquiries"
      );
      const registrationInquiriesArray = getCollectionFromResponse<any>(results.registrationInquiries, "inquiries");

      if (adminDataFetchRequestRef.current !== requestId) {
        return;
      }

      setBusinesses(businessesArray);
      setCategories(categoriesArray);
      setInquiries(inquiriesArray);
      setProfessionals(professionalsArray);
      setBusinessListingInquiries(businessListingInquiriesArray);
      setRegistrationInquiries(registrationInquiriesArray);
      setStats(buildAdminStats(businessesArray, professionalsArray, registrationInquiriesArray));
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      console.error("Failed to fetch data:", error);
      setDataFetchError("Failed to fetch data. Please try again.");
    } finally {
      if (
        adminDataFetchRequestRef.current === requestId &&
        adminDataFetchControllerRef.current === controller
      ) {
        setIsLoading(false);
        adminDataFetchControllerRef.current = null;
      }
    }
  }, [
    setIsLoading,
    setDataFetchError,
    setBusinesses,
    setCategories,
    setInquiries,
    setProfessionals,
    setBusinessListingInquiries,
    setRegistrationInquiries,
    setStats,
  ]);

  useEffect(() => {
    return () => {
      adminDataFetchControllerRef.current?.abort();
    };
  }, []);

  return { fetchData };
}

import { useEffect, useCallback } from "react";
import type { Socket } from "socket.io-client";

interface BusinessSocketSyncOptions {
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  setInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  setBrands: React.Dispatch<React.SetStateAction<any[]>>;
  setStats: React.Dispatch<React.SetStateAction<any>>;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
  businessId: string;
}

export function useSocketSyncBusiness(
  socket: Socket | null,
  isConnected: boolean,
  options: BusinessSocketSyncOptions
) {
  const { setProducts, setInquiries, setCategories, setBrands, setStats, toast, businessId } = options;

  const handleProductCreated = useCallback((data: any) => {
    if (data.businessId === businessId) {
      setProducts((prev) => [data.product, ...prev]);
      setStats((prev: any) => ({ ...prev, totalProducts: (prev?.totalProducts || 0) + 1 }));
    }
  }, [businessId, setProducts, setStats]);

  const handleProductUpdated = useCallback((data: any) => {
    if (data.businessId === businessId) {
      setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
    }
  }, [businessId, setProducts]);

  const handleProductDeleted = useCallback((data: any) => {
    if (data.businessId === businessId) {
      setProducts((prev) => prev.filter((p) => p.id !== data.productId));
      setStats((prev: any) => ({
        ...prev,
        totalProducts: Math.max(0, (prev?.totalProducts || 0) - 1),
        activeProducts: data.isActive ? Math.max(0, (prev?.activeProducts || 0) - 1) : (prev?.activeProducts || 0),
      }));
    }
  }, [businessId, setProducts, setStats]);

  const handleInquiryCreated = useCallback((data: any) => {
    if (data.businessId === businessId) {
      setInquiries((prev) => [data.inquiry, ...prev]);
      setStats((prev: any) => ({
        ...prev,
        totalInquiries: (prev?.totalInquiries || 0) + 1,
        newInquiries: (prev?.newInquiries || 0) + 1,
      }));
      toast({ title: "New Inquiry", description: "You have received a new customer inquiry." });
    }
  }, [businessId, setInquiries, setStats, toast]);

  const handleInquiryUpdated = useCallback((data: any) => {
    if (data.businessId === businessId) {
      setInquiries((prev) => prev.map((i) => (i.id === data.inquiry.id ? data.inquiry : i)));
    }
  }, [businessId, setInquiries]);

  const handleCategoryCreated = useCallback((data: any) => {
    if (data.businessId === businessId) {
      setCategories((prev) => [data.category, ...prev]);
    }
  }, [businessId, setCategories]);

  const handleCategoryDeleted = useCallback((data: any) => {
    if (data.businessId === businessId) {
      setCategories((prev) => prev.filter((c) => c.id !== data.categoryId));
    }
  }, [businessId, setCategories]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("product:created", handleProductCreated);
    socket.on("product:updated", handleProductUpdated);
    socket.on("product:deleted", handleProductDeleted);
    socket.on("inquiry:created", handleInquiryCreated);
    socket.on("inquiry:updated", handleInquiryUpdated);
    socket.on("category:created", handleCategoryCreated);
    socket.on("category:deleted", handleCategoryDeleted);

    return () => {
      socket.off("product:created", handleProductCreated);
      socket.off("product:updated", handleProductUpdated);
      socket.off("product:deleted", handleProductDeleted);
      socket.off("inquiry:created", handleInquiryCreated);
      socket.off("inquiry:updated", handleInquiryUpdated);
      socket.off("category:created", handleCategoryCreated);
      socket.off("category:deleted", handleCategoryDeleted);
    };
  }, [
    socket,
    isConnected,
    handleProductCreated,
    handleProductUpdated,
    handleProductDeleted,
    handleInquiryCreated,
    handleInquiryUpdated,
    handleCategoryCreated,
    handleCategoryDeleted,
  ]);
}
